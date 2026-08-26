const {onRequest}=require("firebase-functions/v2/https");
const {defineSecret}=require("firebase-functions/params");
const admin=require("firebase-admin");
const Razorpay=require("razorpay");
const crypto=require("crypto");
const PDFDocument=require("pdfkit");

admin.initializeApp();
const db=admin.firestore();

const RAZORPAY_KEY_ID=defineSecret("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET=defineSecret("RAZORPAY_KEY_SECRET");

const FEE_PAISE=4900;

const CERTIFICATES={
    "MNA-CERT-2026-00001":{
        courseId:"ui-ux-design",
        courseName:"UI/UX Design",
        eligible:false
    },
    "MNA-CERT-2026-00003":{
        courseId:"web-development",
        courseName:"Full Stack Web Development",
        eligible:false
    },
    "MNA-CERT-2026-00004":{
        courseId:"data-analytics",
        courseName:"Data Analytics",
        eligible:false
    },
    "MNA-CERT-2026-00005":{
        courseId:"react-development",
        courseName:"React Development",
        eligible:false
    },
    "MNA-CERT-2026-00006":{
        courseId:"human-resource-management-ai",
        courseName:"Human Resource Management Using AI",
        eligible:false
    },
    "MNA-CERT-2026-00007":{
        courseId:"professional-communication",
        courseName:"Professional Communication",
        eligible:false
    }
};

function cors(req,res){
    res.set("Access-Control-Allow-Origin","https://mamrajnexusacademy.online");
    res.set("Access-Control-Allow-Headers","Authorization, Content-Type");
    res.set("Access-Control-Allow-Methods","GET, POST, OPTIONS");

    if(req.method==="OPTIONS"){
        res.status(204).send("");
        return true;
    }

    return false;
}

async function authenticate(req){
    const header=req.headers.authorization||"";

    if(!header.startsWith("Bearer ")){
        throw new Error("Please sign in with Google.");
    }

    return admin.auth().verifyIdToken(
        header.substring(7)
    );
}

function razorpay(){
    return new Razorpay({
        key_id:RAZORPAY_KEY_ID.value(),
        key_secret:RAZORPAY_KEY_SECRET.value()
    });
}

function certificateRef(uid,certificateId){
    return db.doc(
        `users/${uid}/certificates/${certificateId}`
    );
}

/* =========================================================
   CERTIFICATE STATE
========================================================= */

exports.certificate=onRequest(
    {
        region:"asia-south1",
        secrets:[
            RAZORPAY_KEY_ID,
            RAZORPAY_KEY_SECRET
        ]
    },
    async(req,res)=>{

        if(cors(req,res)) return;

        try{

            const user =
                await authenticate(req);

            const certificateId =
                String(req.query.id||"");

            const config =
                CERTIFICATES[
                    certificateId
                ];

            if(!config){
                return res.status(404).json({
                    error:"Certificate not found."
                });
            }

            const ref =
                certificateRef(
                    user.uid,
                    certificateId
                );

            const snapshot =
                await ref.get();

            const data =
                snapshot.exists
                    ? snapshot.data()
                    : {};

            /*
             * Eligibility is controlled by course completion.
             * Existing frontend progress is not trusted for payment.
             * The course completion service should write eligible:true.
             */
            return res.json({

                certificateId,

                courseId:
                    config.courseId,

                courseName:
                    config.courseName,

                studentName:
                    user.name ||
                    user.email ||
                    "Student",

                eligible:
                    data.eligible === true,

                paymentVerified:
                    data.paymentVerified === true,

                issuedAt:
                    data.payment?.paidAt ||
                    data.issuedAt ||
                    null
            });

        }catch(error){

            console.error(error);

            return res.status(401).json({
                error:
                    error.message ||
                    "Authentication failed."
            });
        }
    }
);

/* =========================================================
   CREATE ₹49 ORDER
========================================================= */

exports.certificateOrder=onRequest(
    {
        region:"asia-south1",
        secrets:[
            RAZORPAY_KEY_ID,
            RAZORPAY_KEY_SECRET
        ]
    },
    async(req,res)=>{

        if(cors(req,res)) return;

        try{

            const user =
                await authenticate(req);

            const certificateId =
                req.body?.certificateId;

            const config =
                CERTIFICATES[
                    certificateId
                ];

            if(!config){
                return res.status(404).json({
                    error:
                        "Certificate not found."
                });
            }

            const ref =
                certificateRef(
                    user.uid,
                    certificateId
                );

            const snapshot =
                await ref.get();

            const data =
                snapshot.exists
                    ? snapshot.data()
                    : {};

            /*
             * Never trust the browser for eligibility.
             */
            if(data.eligible !== true){
                return res.status(403).json({
                    error:
                        "Complete the course first. The certificate is not eligible yet."
                });
            }

            if(
                data.paymentVerified === true
            ){
                return res.status(409).json({
                    error:
                        "Certificate is already unlocked."
                });
            }

            const order =
                await razorpay()
                    .orders
                    .create({

                        amount:
                            FEE_PAISE,

                        currency:
                            "INR",

                        receipt:
                            `cert_${user.uid.slice(0,10)}_${Date.now()}`,

                        notes:{
                            uid:
                                user.uid,

                            certificateId
                        }
                    });

            await ref.set(
                {
                    courseId:
                        config.courseId,

                    courseName:
                        config.courseName,

                    pendingPayment:{
                        orderId:
                            order.id,

                        amount:
                            FEE_PAISE,

                        createdAt:
                            admin.firestore
                                .FieldValue
                                .serverTimestamp()
                    }
                },
                {
                    merge:true
                }
            );

            return res.json({
                id:
                    order.id,

                amount:
                    FEE_PAISE,

                currency:
                    "INR"
            });

        }catch(error){

            console.error(error);

            return res.status(500).json({
                error:
                    "Could not create Razorpay order."
            });
        }
    }
);

/* =========================================================
   VERIFY RAZORPAY PAYMENT
========================================================= */

exports.certificateVerify=onRequest(
    {
        region:"asia-south1",
        secrets:[
            RAZORPAY_KEY_ID,
            RAZORPAY_KEY_SECRET
        ]
    },
    async(req,res)=>{

        if(cors(req,res)) return;

        try{

            const user =
                await authenticate(req);

            const {
                certificateId,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            } =
                req.body || {};

            if(
                !certificateId ||
                !razorpay_order_id ||
                !razorpay_payment_id ||
                !razorpay_signature
            ){
                return res.status(400).json({
                    verified:false,
                    error:
                        "Missing Razorpay payment fields."
                });
            }

            const config =
                CERTIFICATES[
                    certificateId
                ];

            if(!config){
                return res.status(404).json({
                    verified:false,
                    error:
                        "Certificate not found."
                });
            }

            const ref =
                certificateRef(
                    user.uid,
                    certificateId
                );

            const snapshot =
                await ref.get();

            if(!snapshot.exists){
                return res.status(404).json({
                    verified:false,
                    error:
                        "Certificate not found."
                });
            }

            const data =
                snapshot.data();

            if(
                data.pendingPayment?.orderId !==
                razorpay_order_id
            ){
                return res.status(400).json({
                    verified:false,
                    error:
                        "Order mismatch."
                });
            }

            const expected =
                crypto
                    .createHmac(
                        "sha256",
                        RAZORPAY_KEY_SECRET.value()
                    )
                    .update(
                        razorpay_order_id +
                        "|" +
                        razorpay_payment_id
                    )
                    .digest("hex");

            const a =
                Buffer.from(
                    expected,
                    "utf8"
                );

            const b =
                Buffer.from(
                    razorpay_signature,
                    "utf8"
                );

            if(
                a.length !== b.length ||
                !crypto.timingSafeEqual(a,b)
            ){
                return res.status(400).json({
                    verified:false,
                    error:
                        "Invalid Razorpay signature."
                });
            }

            const payment =
                await razorpay()
                    .payments
                    .fetch(
                        razorpay_payment_id
                    );

            if(
                payment.order_id !==
                razorpay_order_id
            ){
                return res.status(400).json({
                    verified:false,
                    error:
                        "Payment/order mismatch."
                });
            }

            if(
                payment.status !==
                "captured"
            ){
                return res.status(400).json({
                    verified:false,
                    error:
                        "Payment has not been captured."
                });
            }

            if(
                Number(payment.amount) !==
                FEE_PAISE
            ){
                return res.status(400).json({
                    verified:false,
                    error:
                        "Incorrect payment amount."
                });
            }

            await ref.set(
                {
                    paymentVerified:
                        true,

                    payment:{
                        orderId:
                            razorpay_order_id,

                        paymentId:
                            razorpay_payment_id,

                        amount:
                            FEE_PAISE,

                        currency:
                            "INR",

                        paidAt:
                            admin.firestore
                                .FieldValue
                                .serverTimestamp()
                    },

                    pendingPayment:
                        admin.firestore
                            .FieldValue
                            .delete()
                },
                {
                    merge:true
                }
            );

            return res.json({
                verified:true,
                certificateId
            });

        }catch(error){

            console.error(error);

            return res.status(500).json({
                verified:false,
                error:
                    "Payment verification failed."
            });
        }
    }
);

/* =========================================================
   SECURE PDF
========================================================= */

exports.certificatePdf=onRequest(
    {
        region:"asia-south1",
        secrets:[
            RAZORPAY_KEY_ID,
            RAZORPAY_KEY_SECRET
        ]
    },
    async(req,res)=>{

        try{

            const user =
                await authenticate(req);

            const certificateId =
                String(req.query.id||"");

            const ref =
                certificateRef(
                    user.uid,
                    certificateId
                );

            const snapshot =
                await ref.get();

            if(!snapshot.exists){
                return res.status(404).json({
                    error:
                        "Certificate not found."
                });
            }

            const data =
                snapshot.data();

            if(
                data.paymentVerified !== true
            ){
                return res.status(403).json({
                    error:
                        "Certificate is locked. Pay ₹49 first."
                });
            }

            res.set(
                "Content-Type",
                "application/pdf"
            );

            res.set(
                "Content-Disposition",
                `attachment; filename="${certificateId}.pdf"`
            );

            const pdf =
                new PDFDocument({
                    size:"A4",
                    layout:"landscape",
                    margin:0
                });

            pdf.pipe(res);

            const W =
                pdf.page.width;

            const H =
                pdf.page.height;

            pdf
                .rect(0,0,W,H)
                .fill("#fbf1e8");

            pdf
                .lineWidth(10)
                .strokeColor("#ead6c7")
                .rect(
                    18,
                    18,
                    W-36,
                    H-36
                )
                .stroke();

            pdf
                .lineWidth(2)
                .strokeColor("#d6b79f")
                .rect(
                    42,
                    42,
                    W-84,
                    H-84
                )
                .stroke();

            pdf
                .fillColor("#b47b59")
                .font("Helvetica-Bold")
                .fontSize(14)
                .text(
                    "✦  MAMRAJ NEXUS ACADEMY  ✦",
                    0,
                    95,
                    {align:"center"}
                );

            pdf
                .fillColor("#263a7a")
                .font("Times-Bold")
                .fontSize(38)
                .text(
                    "CERTIFICATE OF ACHIEVEMENT",
                    0,
                    140,
                    {align:"center"}
                );

            pdf
                .fillColor("#686d7a")
                .font("Helvetica")
                .fontSize(12)
                .text(
                    "This certificate is proudly presented to",
                    0,
                    215,
                    {align:"center"}
                );

            pdf
                .fillColor("#263a7a")
                .font("Times-Bold")
                .fontSize(30)
                .text(
                    user.name ||
                    user.email ||
                    "Student",
                    0,
                    250,
                    {align:"center"}
                );

            pdf
                .fillColor("#686d7a")
                .font("Helvetica")
                .fontSize(12)
                .text(
                    "for successfully completing",
                    0,
                    305,
                    {align:"center"}
                );

            pdf
                .fillColor("#263a7a")
                .font("Times-Bold")
                .fontSize(22)
                .text(
                    data.courseName ||
                    "Professional Learning Program",
                    0,
                    335,
                    {align:"center"}
                );

            pdf
                .circle(
                    W/2,
                    435,
                    29
                )
                .lineWidth(2)
                .strokeColor("#cf9878")
                .stroke();

            pdf
                .fillColor("#cf9878")
                .font("Helvetica-Bold")
                .fontSize(18)
                .text(
                    "M",
                    W/2-5,
                    424
                );

            pdf
                .fillColor("#777")
                .font("Helvetica")
                .fontSize(9)
                .text(
                    "VERIFIED CERTIFICATE",
                    W/2-55,
                    450,
                    {
                        width:110,
                        align:"center"
                    }
                );

            pdf
                .fillColor("#777")
                .fontSize(9)
                .text(
                    `Certificate ID: ${certificateId}`,
                    0,
                    490,
                    {align:"center"}
                );

            pdf
                .text(
                    `Issued to ${user.email || "student"}`,
                    0,
                    508,
                    {align:"center"}
                );

            pdf.end();

        }catch(error){

            console.error(error);

            if(!res.headersSent){
                return res.status(500).json({
                    error:
                        "PDF generation failed."
                });
            }
        }
    }
);

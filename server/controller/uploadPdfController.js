const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
const pdf = require("pdf-parse");
const tempFilesPath = "./public/uploads/temp";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempFilesPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const upload = multer({ storage: storage });

const uploadFile = (req, res) => {
    upload.single("file")(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json(err);
        } else if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        const filePath = path.join(tempFilesPath, req.file?.filename);

        try {
            const dataBuffer = await fs.readFile(filePath);
            const data = await pdf(dataBuffer);
            const { firstName, lastName, requestedEndDate, telephoneNumber, nationality } =
                extractInformation(data.text);
                // console.log(data.text)
            await fs.unlink(filePath);
            res.status(200).json({
                message: "The file has been uploaded",
                // fileName: req.file?.filename || req.file?.name,
                text: data.text,
                info: {
                    firstName,
                    lastName,
                    requestedEndDate,
                    telephoneNumber,
                    nationality
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "An error occurred while processing the file",
            });
        }
    });
};

const extractInformation = (text) => {
    const regexFirstName = /Adı\s+([^\n]+)/;
    const regexLastName = /Soyadı\s+([^\n]+)/;
    const regex =
        /\(Requested\sEnd\sDate\)\n(\d{1,2}\s*\/\s*\d{1,2}\s*\/\s*\d{4})\d{1,2}/;

    const regexTelephoneNumber = /Telefon\s1\n+([^\n]+)/;
    const regexNationality = /Uyruk\sKimlik\sNoUyruğu\n+([^\n]+)/

    const firstNameMatch = text.match(regexFirstName);
    const lastNameMatch = text.match(regexLastName);
    const requestedEndDateMatch = text.match(regex);
    const telephoneNumberMatch = text.match(regexTelephoneNumber);
    const nationalityMatch = text.match(regexNationality);
    const firstName = firstNameMatch ? firstNameMatch[1].trim() : "";
    const lastName = lastNameMatch ? lastNameMatch[1].trim() : "";
    const requestedEndDate = requestedEndDateMatch
        ? formatDate(requestedEndDateMatch)
        : "";
    const telephoneNumber = telephoneNumberMatch
        ? telephoneNumberMatch[1].trim()
        : "";
    const nationality = nationalityMatch
        ? nationalityMatch[1].trim()
        : "";

    return { firstName, lastName, requestedEndDate, telephoneNumber, nationality };
};

const formatDate = (text) => {
    const dateComponents = text[1]
        .trim()
        .split("/")
        .map((component) => component.trim());

    // Extract day, month, and year from date components
    const day = parseInt(dateComponents[0], 10);
    const month = parseInt(dateComponents[1], 10) - 1; // Months are 0-based in JavaScript (0-Jan, 1-Feb, ...)
    const year = parseInt(dateComponents[2], 10);

    // Create a new Date object with current time
    const currentDate = new Date();
    // Create a new Date object with time set to 9 am
    const requestedEndDate = new Date(year, month, day, 9, 0, 0);

    return requestedEndDate;
};

module.exports = { uploadFile };

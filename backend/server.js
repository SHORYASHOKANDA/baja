const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
const corsOptions = {
    origin: true,
    credentials: true,
};
app.use(cors(corsOptions));

app.get('/bfhl', (req, res) => {
    res.status(200).json({
        "operation_code": 1
    });
});

app.post('/bfhl', (req, res) => {
    console.log(res);
    const { data } = req.body;

    if (!Array.isArray(data)) {
        return res.status(400).json({
            "is_success": false,
            "message": "Invalid input. Ensure 'data' is an array."
        });
    }

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item) && typeof item === 'string');

    const lowercaseAlphabets = alphabets.filter(item => item === item.toLowerCase());
    const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().reverse()[0]] : [];

    const user_id = "john_doe_17091999";
    const email = "john@xyz.com";
    const roll_number = "ABCD123";

    res.status(200).json({
        "is_success": true,
        "user_id": user_id,
        "email": email,
        "roll_number": roll_number,
        "numbers": numbers,
        "alphabets": alphabets,
        "highest_lowercase_alphabet": highestLowercaseAlphabet
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

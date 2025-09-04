import Transaction from "../models/transaction.model.js";


export const createTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getTransactions = async (req, res) => {
    const { page = 1 } = req.query;
    const pageLimit = 50;
    const pageNumber = parseInt(page, 10) || 1;
    const skipCount = (pageNumber - 1) * pageLimit;
    let totalIncome = 0;
    let totalExpense = 0;
    try {
        const totalTransactions = await Transaction.countDocuments();
        const totalPages = Math.ceil(totalTransactions / pageLimit);
        const transactions = await Transaction.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skipCount)
            .limit(pageLimit);

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else if (transaction.type === 'expense') {
                totalExpense += transaction.amount;
            }
        });

        const totalProfit = totalIncome - totalExpense;
        res.status(200).json({
            transactions: transactions,
            totalIncome: totalIncome,
            totalExpense: totalExpense,
            totalProfit: totalProfit,
            totalPages: totalPages
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const searchTransactions = async (req, res) => {
    // Destructure and sanitize query parameters.
    let { from, to, search = "" } = req.query;

    // Construct the date range query.
    const dateQuery = {};

    // Case 1: 'from' date is provided
    if (from) {
        const fromDate = new Date(from);
        if (isNaN(fromDate.getTime())) {
            return res.status(400).json({ message: "Invalid 'from' date." });
        }
        // Set the start date for the query.
        dateQuery.$gte = fromDate;
    }

    // Case 2: 'to' date is provided
    if (to) {
        const toDate = new Date(to);
        if (isNaN(toDate.getTime())) {
            return res.status(400).json({ message: "Invalid 'to' date." });
        }
        // Set the end date for the query by adding one day and using less-than.
        toDate.setDate(toDate.getDate() + 1);
        dateQuery.$lt = toDate;
    } else {
        // If 'to' is not provided, set the end date to "now".
        dateQuery.$lte = new Date();
    }

    // Case 3: Neither 'from' nor 'to' is provided
    // The date range will be from the beginning of time until now.
    // This is handled implicitly by the conditional logic.

    // Final MongoDB query object
    const mongoQuery = {
        createdAt: dateQuery,
    };

    try {
        // Fetch all transactions that match the date range and sort them.
        let transactions = await Transaction.find(mongoQuery)
            .sort({ createdAt: -1 }); // Sort by newest first

        // If a search term is provided, filter the results on the server side.
        if (search) {
            const searchRegex = new RegExp(search, "i"); // Case-insensitive regex
            transactions = transactions.filter(transaction => {
                // Check if the search term matches any of the fields.
                return (
                    (transaction.title && searchRegex.test(transaction.title)) ||
                    (transaction.amount && searchRegex.test(transaction.amount.toString())) ||
                    (transaction.type && searchRegex.test(transaction.type))
                );
            });
        }

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else if (transaction.type === 'expense') {
                totalExpense += transaction.amount;
            }
        });

        const totalProfit = totalIncome - totalExpense;
        res.status(200).json({
            transactions: transactions,
            totalIncome: totalIncome,
            totalExpense: totalExpense,
            totalProfit: totalProfit,
        });

    } catch (error) {
        // Handle server-side errors.
        console.error("Error fetching transactions:", error);
        res.status(500).json({
            message: "An internal server error occurred.",
            error: error.message,
        });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
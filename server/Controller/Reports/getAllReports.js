const flightHistory = require('../../models/flightHistory'); 

const getAllReports = async (req, res) => {
    try {
        const reports = await flightHistory.find();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving reports', error });
    }
};

module.exports = getAllReports;

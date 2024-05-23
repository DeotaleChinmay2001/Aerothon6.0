const flightHistory = require('../../models/flightHistory'); 

const getUserReports = async (req, res) => {
    try {
        const userName = req.params.userName;
        console.log("chinmay", userName);
        const reports = await flightHistory.find({ User: userName });
        res.status(200).json(reports);
      } catch (error) {
        res.status(500).json({ message: 'Error retrieving reports', error });
      }
};

module.exports = getUserReports;

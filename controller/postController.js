
const User = require('../model/user');

exports.getRecentPortfolios = async (req, res) => {
  try {
    
    const users = await User.find().select('fullName profile_img skills projects username votes');


    res.json(users);
  } catch (error) {
    console.error("❌ Failed to fetch recent portfolios:", error);
    res.status(500).json({ message: 'Error fetching recent portfolios' });
  }
};

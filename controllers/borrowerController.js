import  Borrower from '../models/Borrower.js';
export const createBorrower = async (req, res, next) => {
  try {
    const borrower = await Borrower.create(req.body);
    res.status(201).json(borrower);
  } catch (err) {
    next(err);
  }
}

export const getBorrowers = async (req, res, next) => {
    try {
        const borrowers = await Borrower.findAll();
        res.json(borrowers);
    } catch (err) {
        next(err);
    }
};

// Delete borrower
export const deleteBorrower = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Borrower.destroy({ where: { id } });
    res.json({ message: "Borrower deleted" });
  } catch (err) {
    next(err);
  }
};


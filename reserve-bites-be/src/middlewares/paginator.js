export default async (req, res, next) => {
  try {
    let { page, sortBy } = req.query;
    page = Number(page) || 1;
    sortBy = (sortBy === 'newest' ? 'desc' : 'asc') || 'desc';
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const paginator = { page, pageSize, offset, sortBy };
    req.paginator = paginator;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: 'Something wrong with paginator middleware', error });
  }
};

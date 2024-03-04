export default async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.isOwner) {
      return res
        .status(403)
        .json({ message: 'You are not owner to make this action' });
    }
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Something wrong with verify owner', error });
  }
};

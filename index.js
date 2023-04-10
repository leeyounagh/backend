cons                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ;
    }
    //상품이 이미 있지않을때
    else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            good: {
              id: req.body.contentsId,
              quantity: 1,
              image: req.body.image,
              address: req.body.address,
              title: req.body.title,

              date: Date.now(),
            },
          },
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          res.status(200).send(userInfo.good);
        }
      );
    }
  });
});

app.get("/api/users/removeFromGood", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id }, //$pull 상품지우기
    {
      $pull: { good: { id: req.query.id } },
    },
    { new: true },
    (err, userInfo) => {
      let cart = userInfo.good;

      if (err) return res.status(400).json({ success: false, err });
      res.status(200).send(cart);
    }
  );
});

app.post("/api/users/addschedule", auth, (req, res) => {
  //먼저 user collection 에 해당유저의 정보를 가져오기
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          schedule: {
            writer: req.body.writer,
            title: req.body.title,
            desc: req.body.desc,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            id: req.body.id,
            date: Date.now(),
          },
        },
      },
      { new: true },
      (err, userInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, userInfo });
      }
    );
  });
});

app.delete("/api/users/removefromschedule", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id }, //$pull 상품지우기
    {
      $pull: { schedule: { id: req.query.id } },
    },
    { new: true },
    (err, userInfo) => {
      let scd = userInfo.schedule;

      if (err) return res.status(400).json({ success: false, err });
      res.status(200).send({ success: true, scd });
    }
  );
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).single("file");

app.post("/api/contents/image", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

app.post("/api/users/addcommunity", (req, res) => {
  const contents = new Contents(req.body);

  contents.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.get("/api/users/addcommunity/letter", (req, res) => {
  Contents.find()
    .populate("writer", "name")

    .exec((err, productInfo) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, productInfo });
    });
});

app.get("/api/users/addcommunity/letter/letter_by_id", (req, res) => {
  let type = req.query.type;
  let productId = req.query.contentsid;

  Contents.find({ _id: productId })
    .populate("writer", "name")
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ success: true, product });
    });
});

app.post("/api/users/addcommunity/letter/comment", auth, (req, res) => {
  //먼저 user collection 에 해당유저의 정보를 가져오기

  let productId = req.query.contentsid;

  Contents.findOne({ _id: productId }, (err, userInfo) => {
    Contents.findOneAndUpdate(
      { _id: productId },
      {
        $push: {
          comment: {
            writer: req.body.writer,
            comment: req.body.comment,
            date: Date.now(),
          },
        },
      },
      { new: true },
      (err, userInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, userInfo });
      }
    );
  });
});

app.post("/api/users/addToStyle", auth, (req, res) => {
  //먼저 user collection 에 해당유저의 정보를 가져오기
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    //상품이 이미 있지않을때

    User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          userStyle: req.body.UserStyle,
        },
      },
      { new: true },
      (err, userInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, userInfo });
      }
    );
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

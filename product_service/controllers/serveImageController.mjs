import path from 'path';

export const serveImages =  (req, res) => {
    const thumbnailPath = path.resolve("public" + req.params.path);
    res.sendFile(thumbnailPath, (err) => {
        if (err) {
          res.status(404).json({ message: 'Thumbnail not found' });
        }
      });
};
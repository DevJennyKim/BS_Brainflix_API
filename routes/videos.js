import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get('/videos', (req, res) => {
  fs.readFile('data/videos.json', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading data from file', err);
      return res.status(500).json({
        error: 'Error reading file',
      });
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (error) {
      console.error('Error', error);
      res.status(500).json({ error: 'Error' });
    }
  });
});

router.get('/videos/:videoId', (req, res) => {
  fs.readFile('data/videos.json', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading data from file', err);
      return res.status(500).json({
        error: 'Error reading file',
      });
    }
    try {
      const jsonData = JSON.parse(data);
      const foundData = jsonData.find(
        (video) => video.id === req.params.videoId
      );
      res.json(foundData);
    } catch (error) {
      console.error('Error', error);
      res.status(500).json({ error: 'Error' });
    }
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../haeun-kim-brainflix/public/images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.originalname;
    cb(null, filename.replace(/\s+/g, ''));
  },
});

const upload = multer({ storage });
router.post('/videos/uploadImg', upload.single('file'), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

router.post('/videos', (req, res) => {
  fs.readFile('data/videos.json', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading data from file', err);
      return res.status(500).json({ error: 'Error reading file' });
    }

    try {
      const parsedVideos = JSON.parse(data);
      const imgName = req.body.image.replace(/\s+/g, '');
      const newVideo = {
        id: uuidv4(),
        title: req.body.title,
        channel: 'Jenny Kim',
        image: '../public/images/' + imgName,
        description: req.body.description,
        views: '0',
        likes: '0',
        duration: '10:00',
        video: 'https://unit-3-project-api-0a5620414506.herokuapp.com/stream',
        timestamp: Date.now(),
        comments: [],
      };
      parsedVideos.push(newVideo);

      fs.writeFileSync('./data/videos.json', JSON.stringify(parsedVideos));
      res.status(201).send('you have created a new video!');
    } catch (parseError) {
      console.error('Error parsing data', parseError);
      res.status(500).json({ error: 'Error parsing data' });
    }
  });
});

router.post('/videos/:videoId/comments', (req, res) => {
  fs.readFile('data/videos.json', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading data from file', err);
      return res.status(500).json({ error: 'Error reading file' });
    }
    try {
      const videoId = req.params.videoId;
      const videos = JSON.parse(data);
      const video = videos.find((v) => v.id === videoId);

      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      const newComment = {
        id: uuidv4(),
        name: req.body.name,
        comment: req.body.comment,
        likes: 0,
        timestamp: Date.now(),
      };

      video.comments.push(newComment);

      fs.writeFile(
        'data/videos.json',
        JSON.stringify(videos, null, 2),
        (err) => {
          if (err) {
            console.error('Error writing file', err);
            return res.status(500).json({ error: 'Error saving comment' });
          }

          res.status(201).json(newComment);
        }
      );
    } catch (err) {
      console.error('Error processing data', err);
      res.status(500).json({ error: 'Error adding comment' });
    }
  });
});

router.delete('/videos/:videoId/comments/:commentId', (req, res) => {
  fs.readFile('data/videos.json', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading data from file', err);
      return res.status(500).json({ error: 'Error reading file' });
    }
    try {
      const commentId = req.params.commentId;
      const videoId = req.params.videoId;
      const videos = JSON.parse(data);
      const video = videos.find((v) => v.id === videoId);

      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      const afterDeleteComments = (video.comments = video.comments.filter(
        (c) => c.id !== commentId
      ));

      // if (!comment) {
      //   return res.status(404).json({ error: 'Comment not found' });
      // }

      fs.writeFile(
        'data/videos.json',
        JSON.stringify(videos, null, 2),
        (err, data) => {
          if (err) {
            console.error('Error writing file', err);
            return res.status(500).json({ error: 'Error saving file' });
          }
        }
      );
      res.status(201).send('you have deleted a comment!');
    } catch (err) {
      console.error('Error processing data', err);
      res.status(500).json({ error: 'Error deleting comment' });
    }
  });
});

export default router;

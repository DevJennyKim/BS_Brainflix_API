import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

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
      const foundData = jsonData.find((video) => video.id === req.params.id);
      res.json(foundData);
    } catch (error) {
      console.error('Error', error);
      res.status(500).json({ error: 'Error' });
    }
  });
});

router.post('/video/:videoId', (req, res) => {
  console.log(req.body);
  fs.readFile('data/videos.json', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading data from file', err);
      return res.status(500).json({ error: 'Error reading file' });
    }
    try {
      const parsedVideos = JSON.parse(data);
      const newVideo = {
        id: uuidv4(),
        title: req.body.title,
        channel: 'Jenny Kim',
        image:
          'https://unit-3-project-api-0a5620414506.herokuapp.com/images/image8.jpg',
        description: req.body.description,
        views: '0',
        likes: '0',
        duration: '10:00',
        video: 'https://unit-3-project-api-0a5620414506.herokuapp.com/stream',
        timestamp: Date.now(),
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

router.post('/video/:videoId/comments', (req, res) => {
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

router.delete('/:videoId/comments/:commentId', (req, res) => {
  res.send('hello this is delete!');
});

export default router;

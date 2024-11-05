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

router.post('/:videoId/comments', (req, res) => {
  console.log(req.body);
  const { name, comment } = req.body;
  const videoId = req.params.id;

  if (!name || !comment) {
    return res.status(400).json({ error: 'Name and comment are required' });
  }
});

router.delete('/:videoId/comments/:commentId');

export default router;

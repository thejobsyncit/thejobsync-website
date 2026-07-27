export default function handler(req, res) {
  res.status(200).json({ status: 'ok', message: 'The Jobsync Serverless API is running' });
}

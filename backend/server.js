const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(cors()); 

let leaveRequests = [];

app.post('/submit-leave', (req, res) => {
  const { firstName, lastName, reason } = req.body;
  const newRequest = {
    id: leaveRequests.length + 1,
    firstName,
    lastName,
    reason,
    status: 'Pending'
  };
  leaveRequests.push(newRequest);
  res.json({ message: 'Leave request submitted', requestId: newRequest.id });
});

app.get('/view-requests', (req, res) => {
  res.json(leaveRequests);
});

app.post('/update-request', (req, res) => {
  const { requestId, status } = req.body;
  const request = leaveRequests.find(r => r.id === requestId);
  if (request) {
    request.status = status;
    res.json({ message: 'Request updated', request });
  } else {
    res.status(404).json({ message: 'Request not found' });
  }
});

app.get('/request-status/:id', (req, res) => {
    const requestId = parseInt(req.params.id);
    const request = leaveRequests.find(r => r.id === requestId);
  
    if (request) {
      res.json({ status: request.status });
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

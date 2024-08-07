import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, ListGroup, Form, Button, Row, Col, FormControl, ButtonGroup, ToggleButton } from 'react-bootstrap';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { utils, read, writeFile } from 'xlsx';


const Student = () => {
  const api = "http://localhost:3001";
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [sex, setSex] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchAge, setSearchAge] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchSex, setSearchSex] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const userRole = window.localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${api}/students`)
      .then(res => setStudents(res.data));
  }, [api]);

  const filteredStudents = students.filter(student =>
  student.name.toLowerCase().includes(searchName.toLowerCase()) &&
  String(student.age).includes(searchAge) &&
  student.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
  student.sex.toLowerCase().includes(searchSex.toLowerCase()) &&
  student.address.toLowerCase().includes(searchAddress.toLowerCase()) &&
  String(student.phone).toLowerCase().includes(searchPhone.toLowerCase())
);

  const addStudent = () => {
    if (name && age && email && sex && address && phone) {
      axios.post(`${api}/addStudent`, { name, age, email, sex, address, phone })
        .then(res => {
          setStudents([...students, res.data]);
          setShowForm(false);
          setName('');
          setAge('');
          setEmail('');
          setSex('');
          setAddress('');
          setPhone('');
        })
        .catch(err => console.error('Error adding student:', err));
    }
  };

  const updateStudent = () => {
    if (name && age && email && sex && address && phone && editingStudent) {
      axios.put(`${api}/updateStudent/${editingStudent._id}`, { name, age, email, sex, address, phone })
        .then(res => {
          setStudents(students.map(student => student._id === editingStudent._id ? res.data : student));
          setEditingStudent(null);
          setName('');
          setAge('');
          setEmail('');
          setSex('');
          setAddress('');
          setPhone('');
          setShowEditForm(false);
        })
        .catch(error => console.error('Error updating student:', error));
    }
  };

  const deleteStudent = (id) => {
    axios.delete(`${api}/deleteStudent/${id}`)
      .then(() => {
        setStudents(students.filter(student => student._id !== id));
      })
      .catch(err => console.error('Error deleting student:', err));
  };

  const handleLogout = () => {
    window.localStorage.removeItem("role");
    window.localStorage.removeItem("userID");
    navigate('/');
  };

const exportToExcel = () => {
  const ws = utils.json_to_sheet(students);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Students');
  writeFile(wb, 'students.xlsx');
};

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(sheet);
      setStudents(jsonData); 
    };

    reader.readAsArrayBuffer(file);
  };





  return (
    <Container className="student-container">
      <div className="d-flex justify-content-end my-4">
        {userRole === 'admin' && (
          <Button variant="primary" onClick={() => navigate('/register')} className="me-2"> New User</Button>)}
        <Button variant="secondary" onClick={handleLogout}>Log Out</Button>
      </div>

      {(userRole === 'admin' || userRole === 'Supervisor') && (
        <Button variant="secondary" onClick={() => {
          setShowForm(!showForm);
          setShowEditForm(false);
        }} className="my-4">
          {showForm ? 'Cancel' : 'Add Student'}
        </Button>
      )}
      <Row className="my-4">
        <Col md={3} className="search-col">
          <Form className="search-form">
            <Form.Group controlId="formNameSearch">
              <Form.Label>Name</Form.Label>
              <FormControl type="text"placeholder="Search by name"value={searchName}onChange={e => setSearchName(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="formAgeSearch" className="mt-3">
              <Form.Label>Age</Form.Label>
              <FormControl type="text"placeholder="Search by age" value={searchAge} onChange={e => setSearchAge(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="formEmailSearch" className="mt-3">
              <Form.Label>Email</Form.Label>
              <FormControl type="text"placeholder="Search by email"value={searchEmail} onChange={e => setSearchEmail(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formSexSearch" className="mt-3">
              <Form.Label>Sex</Form.Label>
              <FormControl type="text" placeholder="Search by sex"value={searchSex}onChange={e => setSearchSex(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="formAddressSearch" className="mt-3">
              <Form.Label>Address</Form.Label>
              <FormControl type="text" placeholder="Search by address" value={searchAddress} onChange={e => setSearchAddress(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formPhoneSearch" className="mt-3">
              <Form.Label>Phone</Form.Label>
              <FormControl type="text"placeholder="Search by phone" value={searchPhone} onChange={e => setSearchPhone(e.target.value)}/>
            </Form.Group>
          </Form>
          {(userRole === 'admin' || userRole === 'Supervisor') && (
          <Button variant="primary" onClick={exportToExcel} className="my-4">Export to Excel</Button>)}
          <Form.Group>
            {(userRole === 'admin' || userRole === 'Supervisor') && (
            <Form.Label>Import Students from Excel</Form.Label>
            )}
            {(userRole === 'admin' || userRole === 'Supervisor') && (
            <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
             )}
          </Form.Group>
        </Col>   
        <Col md={9} className="student-list-col">
          {(showForm || showEditForm) && (
            <Card className="form-card mb-4">
              <Card.Header>{showEditForm ? 'Edit Student' : 'Add Student'}</Card.Header>
              <Card.Body>
                <Form className="form-section">
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} />
                  </Form.Group>
                  <Form.Group controlId="formAge">
                    <Form.Label>Age</Form.Label>
                    <Form.Control type="number" placeholder="Enter age" value={age} onChange={e => setAge(e.target.value)} />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                  </Form.Group>
                  <Form.Group controlId="formSex">
                    <Form.Label>Sex</Form.Label>
                    <Form.Control as="select" value={sex} onChange={e => setSex(e.target.value)}>
                      <option value="">Select Sex</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Enter address" value={address} onChange={e => setAddress(e.target.value)} />
                  </Form.Group>
                  <Form.Group controlId="formPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" placeholder="Enter phone number" value={phone} onChange={e => setPhone(e.target.value)} />
                  </Form.Group>
                  <br />
                  
                  {(userRole === 'admin' || userRole === 'Supervisor') && (
                    <Button variant="primary" onClick={showEditForm ? updateStudent : addStudent}>
                      {showEditForm ? 'Update Student' : 'Add Student'}
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => {
                    setShowForm(false);
                    setShowEditForm(false);
                    setEditingStudent(null);
                    setName('');
                    setAge('');
                    setEmail('');
                    setSex('');
                    setAddress('');
                    setPhone('');
                  }} className="ms-2">
                    Cancel
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          <Row className="my-4">
            {(searchName || searchAge || searchEmail || searchSex || searchAddress || searchPhone ? filteredStudents : students).map(student => (
              <Col sm={12} md={6} lg={4} key={student._id}>
                <Card border="primary" className="student-card mb-3">
                  <Card.Header>Student Info</Card.Header>
                  <Card.Body className="student-card-body">
                    <div className="student-details">
                      <ListGroup variant="flush">
                        <ListGroup.Item><strong>Name:</strong> {student.name}</ListGroup.Item>
                        <ListGroup.Item><strong>Age:</strong> {student.age}</ListGroup.Item>
                        <ListGroup.Item><strong>Email:</strong> {student.email}</ListGroup.Item>
                        <ListGroup.Item><strong>Sex:</strong> {student.sex}</ListGroup.Item>
                        <ListGroup.Item><strong>Address:</strong> {student.address}</ListGroup.Item>
                        <ListGroup.Item><strong>Phone:</strong> {student.phone}</ListGroup.Item>
                      </ListGroup>
                    </div>
                    {(userRole === 'admin' || userRole === 'Supervisor') && (
                      <ButtonGroup className="student-actions">
                        <ToggleButton
                          variant="outline-warning"
                          size="sm"
                          onClick={() => {
                            setEditingStudent(student);
                            setName(student.name);
                            setAge(student.age);
                            setEmail(student.email);
                            setSex(student.sex);
                            setAddress(student.address);
                            setPhone(student.phone);
                            setShowEditForm(true);
                            setShowForm(false);
                          }}
                        >
                          Edit
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteStudent(student._id)}
                        >
                          Delete
                        </ToggleButton>
                      </ButtonGroup>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Student;

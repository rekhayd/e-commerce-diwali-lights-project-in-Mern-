import React, { useState, useEffect } from 'react';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { Table, Spinner, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ start: '', end: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 5;

  const fetchReports = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/reports', {
        params: { ...filters, page, limit },
      });
      console.log("Fetched reports:", res.data);
      setReports(res.data.data);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotalRecords(res.data.totalRecords);
    } catch (err) {
      iziToast.error({ message: 'Failed to load reports' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(reports.map(r => ({
      User: r.user?.name || 'N/A',
      Amount: r.amount,
      Status: r.status,
      Date: new Date(r.date).toLocaleDateString()
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "report.xlsx");
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      fetchReports(pageNum);
    }
  };

  return (
    <Container>
      <h2 className="my-4 text-center">Reports Dashboard</h2>

      <Row className="mb-3">
        <Col><Form.Control type="date" name="start" value={filters.start} onChange={handleChange} /></Col>
        <Col><Form.Control type="date" name="end" value={filters.end} onChange={handleChange} /></Col>
        <Col>
          <Form.Select name="status" value={filters.status} onChange={handleChange}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Form.Select>
        </Col>
        <Col><Button onClick={() => fetchReports(1)}>Filter</Button></Col>
        <Col><Button variant="success" onClick={handleExport}>Export Excel</Button></Col>
      </Row>

      <div className="mb-2 text-end text-muted">Total Records: {totalRecords}</div>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
       
          <tbody>
  {reports.map((order) => (
    <tr key={order._id}>
      <td>{order.buyerName}</td>
      <td>{order.buyerEmail}</td>
      <td>{order.totalPrice}</td>
      <td>{order.status}</td>
      <td>{new Date(order.createdAt).toLocaleString()}</td>
    </tr>
  ))}
</tbody>

        </Table>
      )}

      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center my-3 gap-2 flex-wrap">
          <Button variant="secondary" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Prev</Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={i + 1 === currentPage ? 'primary' : 'light'}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button variant="secondary" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
        </div>
      )}
    </Container>
  );
};

export default ReportPage;

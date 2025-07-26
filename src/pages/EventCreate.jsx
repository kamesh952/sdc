import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

// API configuration using environment variables
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  ENDPOINTS: {
    EVENTS: '/api/events'
  }
};

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Outfit', sans-serif;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 28rem;
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  text-align: center;
  color: #1e293b;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 1rem;
  min-height: 6rem;
  transition: all 0.2s;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #4f46e5;
  color: white;
  font-weight: 500;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  &:hover {
    background-color: #4338ca;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5);
  }
`;

const EventCreate = () => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login first!');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EVENTS}`,
        eventData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      navigate('/events', { state: { success: 'Event created successfully!' } });
    } catch (error) {
      console.error('Error creating event:', error);
      setError(error.response?.data?.error || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Title>Create New Event</Title>
        <Form onSubmit={handleCreateEvent}>
          {error && (
            <div style={{ 
              color: '#ef4444',
              backgroundColor: '#fef2f2',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <FormGroup>
            <Label htmlFor="title">Event Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              required
              placeholder="Describe your event"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="date">Date</Label>
            <Input
              type="datetime-local"
              id="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              id="location"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              required
              placeholder="Where is the event?"
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </SubmitButton>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default EventCreate;
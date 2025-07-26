import React, { useState, useEffect } from 'react';
import {
  getEvents,
  createEvent,
  deleteEvent,
  getProfile,
  logoutUser
} from '../api/api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get token from local storage
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userData = await getProfile(token);
        setUser(userData);
        
        // Fetch events
        const eventsData = await getEvents();
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      // Redirect to login if no token
      window.location.href = '/login';
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdEvent = await createEvent(newEvent, token);
      setEvents(prev => [...prev, createdEvent]);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        location: ''
      });
    } catch (err) {
      setError('Failed to create event');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id, token);
      setEvents(prev => prev.filter(event => event._id !== id));
    } catch (err) {
      setError('Failed to delete event');
    }
  };

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/login';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <h1>Event Dashboard</h1>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.name}</span>
          <button style={styles.button} onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div style={styles.eventForm}>
        <h2>Create New Event</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            name="title"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            style={styles.textarea}
            name="description"
            placeholder="Description"
            value={newEvent.description}
            onChange={handleInputChange}
            required
          />
          <input
            style={styles.input}
            type="datetime-local"
            name="date"
            value={newEvent.date}
            onChange={handleInputChange}
            required
          />
          <input
            style={styles.input}
            type="text"
            name="location"
            placeholder="Location"
            value={newEvent.location}
            onChange={handleInputChange}
            required
          />
          <button style={styles.button} type="submit">Create Event</button>
        </form>
      </div>

      <div style={styles.eventsList}>
        <h2>Upcoming Events</h2>
        {events.length === 0 ? (
          <p>No events found</p>
        ) : (
          <ul style={styles.ul}>
            {events.map(event => (
              <li key={event._id} style={styles.li}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>Date: {new Date(event.date).toLocaleString()}</p>
                <p>Location: {event.location}</p>
                <p>Created by: {event.creator?.name || 'Unknown'}</p>
                {user && user._id === event.creator?._id && (
                  <button 
                    style={{ ...styles.button, ...styles.deleteButton }}
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Styles object
const styles = {
  dashboard: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  eventForm: {
    background: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px'
  },
  form: {
    display: 'grid',
    gap: '15px',
    maxWidth: '600px'
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px'
  },
  textarea: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    minHeight: '100px',
    resize: 'vertical'
  },
  button: {
    padding: '10px 16px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background 0.3s'
  },
  deleteButton: {
    background: '#dc3545',
    marginTop: '10px'
  },
  eventsList: {
    marginTop: '30px'
  },
  ul: {
    listStyle: 'none',
    padding: '0',
    display: 'grid',
    gap: '20px'
  },
  li: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
};

export default Dashboard;
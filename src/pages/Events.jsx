import React, { useEffect, useState } from "react";
import axios from "axios";
import styled, { keyframes, css } from "styled-components";

// API configuration using environment variables
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  ENDPOINTS: {
    USERS: '/api/users/profile',
    EVENTS: '/api/events',
    BOOKINGS: '/api/bookings'
  }
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeInUp = keyframes`
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const Container = styled.div`
  font-family: "Outfit", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.5rem;
  animation: ${fadeInUp} 1s ease;
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  animation: ${fadeIn} 1s ease;
`;

const EventCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const EventImage = styled.div`
  height: 180px;
  background: ${(props) =>
    `linear-gradient(to right, ${props.gradientStart}, ${props.gradientEnd})`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 600;
`;

const EventContent = styled.div`
  padding: 1.5rem;
`;

const EventTitle = styled.h3`
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
`;

const EventDescription = styled.p`
  color: #4a5568;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const EventMeta = styled.p`
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.5rem;
  }
`;

const ButtonBase = styled.button`
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    cursor: not-allowed;
    transform: none;
  }
`;

const PrimaryButton = styled(ButtonBase)`
  background: #4f46e5;
  &:hover {
    background: #4338ca;
    transform: translateY(-2px);
  }
  &:disabled {
    background: #a5b4fc;
  }
  ${(props) =>
    props.pulse &&
    css`
      animation: ${pulse} 2s infinite;
    `}
`;

const SecondaryButton = styled(ButtonBase)`
  background: #e5e7eb;
  color: #4b5563;
  &:hover {
    background: #d1d5db;
    color: #1f2937;
    transform: translateY(-2px);
  }
`;

// Gradient colors for event cards
const gradients = [
  { start: "#6366f1", end: "#8b5cf6" },
  { start: "#ec4899", end: "#f43f5e" },
  { start: "#f59e0b", end: "#ef4444" },
  { start: "#10b981", end: "#3b82f6" },
  { start: "#64748b", end: "#475569" },
];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([
          fetchUserData(),
          fetchEvents(),
          fetchUserBookings(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserId(response.data.id);
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EVENTS}`
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  };

  const fetchUserBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOKINGS}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const bookedEventIds = response.data.map((booking) => booking.eventId);
      setRegisteredEvents(bookedEventIds);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOKINGS}`,
        { eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRegisteredEvents((prev) => [...prev, eventId]);
    } catch (error) {
      console.error("Error registering for event:", error);
      setError("Failed to register for event. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>Loading Events...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Upcoming Events</Title>

      {error && (
        <div style={{ 
          color: "#e53e3e", 
          backgroundColor: "#fff5f5",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginBottom: "2rem",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <p style={{ textAlign: "center", color: "#718096" }}>
          No events available at the moment.
        </p>
      ) : (
        <EventsGrid>
          {events.map((event, index) => {
            const gradient = gradients[index % gradients.length];
            return (
              <EventCard key={event.id}>
                <EventImage
                  gradientStart={gradient.start}
                  gradientEnd={gradient.end}
                >
                  {event.title.charAt(0).toUpperCase()}
                </EventImage>
                <EventContent>
                  <EventTitle>{event.title}</EventTitle>
                  <EventDescription>{event.description}</EventDescription>

                  <EventMeta>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </EventMeta>

                  <EventMeta>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {event.location}
                  </EventMeta>

                  {registeredEvents.includes(event.id) ? (
                    <SecondaryButton disabled>Registered</SecondaryButton>
                  ) : (
                    <PrimaryButton
                      onClick={() => handleRegister(event.id)}
                      pulse={!registeredEvents.includes(event.id)}
                    >
                      Book Now
                    </PrimaryButton>
                  )}
                </EventContent>
              </EventCard>
            );
          })}
        </EventsGrid>
      )}
    </Container>
  );
};

export default Events;
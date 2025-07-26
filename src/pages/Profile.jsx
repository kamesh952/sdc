import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { keyframes } from "styled-components";
import userIcon from "./user_icon.png";

// API configuration using environment variables
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  ENDPOINTS: {
    PROFILE: '/api/users/profile',
    BOOKINGS: '/api/bookings'
  }
};

// Animations
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  font-family: 'Outfit', sans-serif;
`;

const NavBar = styled.nav`
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BrandLogo = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BrandText = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
`;

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
`;

const PrimaryButton = styled(Button)`
  background: #3b82f6;
  color: white;
  &:hover {
    background: #2563eb;
  }
`;

const SecondaryButton = styled(Button)`
  background: #f3f4f6;
  color: #4b5563;
  &:hover {
    background: #e5e7eb;
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 2fr;
  }
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  position: relative;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(to bottom right, #e0f2fe, #dbeafe);
`;

const Avatar = styled.div`
  width: 6rem;
  height: 6rem;
  margin: 0 auto 1.5rem;
  border-radius: 9999px;
  background: linear-gradient(to bottom right, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: #6b7280;
  margin-bottom: 1rem;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #e0f2fe;
  color: #0369a1;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
`;

const StatsContainer = styled.div`
  padding: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const StatItem = styled.div`
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.color || '#3b82f6'};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const InfoList = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
`;

const InfoLabel = styled.span`
  color: #6b7280;
`;

const InfoValue = styled.span`
  color: #1f2937;
`;

const StatusIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.color || '#10b981'};
`;

const Dot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: ${props => props.color || '#10b981'};
`;

const BookingsCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const CardHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CardIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: linear-gradient(to bottom right, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardText = styled.div`
  h2 {
    font-size: 1.25rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
  p {
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s;
  &:hover {
    background: #e5e7eb;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  svg {
    animation: ${props => props.loading ? spin : 'none'} 1s linear infinite;
  }
`;

const CardContent = styled.div`
  padding: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
`;

const EmptyIcon = styled.div`
  width: 5rem;
  height: 5rem;
  margin: 0 auto 1.5rem;
  background: #f3f4f6;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyText = styled.div`
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }
  p {
    color: #6b7280;
    margin-bottom: 1.5rem;
    max-width: 28rem;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ExploreButton = styled.button`
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  font-weight: 500;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
  transition: all 0.2s;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
  }
`;

const BookingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BookingItem = styled.div`
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
  &:hover {
    background: #f3f4f6;
  }
`;

const BookingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const BookingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BookingIcon = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(to bottom right, #e0f2fe, #dbeafe);
  border-radius: 0.75rem;
  border: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BookingDetails = styled.div`
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
`;

const BookingMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const BookingStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid;
  ${props => {
    if (props.status === 'confirmed') {
      return `
        background: #ecfdf5;
        color: #065f46;
        border-color: #a7f3d0;
      `;
    } else if (props.status === 'canceled') {
      return `
        background: #fef2f2;
        color: #b91c1c;
        border-color: #fecaca;
      `;
    } else {
      return `
        background: #fef3c7;
        color: #92400e;
        border-color: #fcd34d;
      `;
    }
  }}
`;

const CancelButton = styled.button`
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  &:hover {
    background: #fee2e2;
  }
`;

const LoadingContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
`;

const Spinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 9999px;
  animation: ${spin} 1s linear infinite;
`;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchBookings();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setUser(response.data.user || response.data);
      } else {
        throw new Error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setBookingLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOKINGS}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      if (window.confirm("Are you sure you want to unregister from this event?")) {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOKINGS}/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== bookingId)
        );
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to unregister. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      <NavBar>
        <NavContent>
          <Brand>
            <BrandLogo>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </BrandLogo>
            <BrandText>Dashboard</BrandText>
          </Brand>

          <NavButtons>
            <PrimaryButton onClick={() => navigate("/events")}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Event
            </PrimaryButton>
            <SecondaryButton onClick={handleLogout}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </SecondaryButton>
          </NavButtons>
        </NavContent>
      </NavBar>

      <MainContent>
        <GridContainer>
          <ProfileCard>
            <ProfileHeader>
              <Avatar>
                <img
                  src={userIcon}
                  alt="User"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Avatar>
              <UserName>{user?.firstName} {user?.lastName}</UserName>
              <UserEmail>{user?.email}</UserEmail>
              <Badge>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified Member
              </Badge>
            </ProfileHeader>

            <StatsContainer>
              <StatsGrid>
                <StatItem>
                  <StatValue>{bookings.length}</StatValue>
                  <StatLabel>Total Events</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue color="#10b981">
                    {bookings.filter((b) => b.status === "confirmed").length}
                  </StatValue>
                  <StatLabel>Confirmed</StatLabel>
                </StatItem>
              </StatsGrid>

              <InfoList>
                <InfoItem>
                  <InfoLabel>Member since</InfoLabel>
                  <InfoValue>
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Account Status</InfoLabel>
                  <InfoValue>
                    <StatusIndicator>
                      <Dot />
                      Active
                    </StatusIndicator>
                  </InfoValue>
                </InfoItem>
              </InfoList>
            </StatsContainer>
          </ProfileCard>

          <BookingsCard>
            <CardHeader>
              <CardTitle>
                <CardIcon>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </CardIcon>
                <CardText>
                  <h2>My Events</h2>
                  <p>Manage your event bookings</p>
                </CardText>
              </CardTitle>

              <RefreshButton 
                onClick={fetchBookings}
                disabled={bookingLoading}
                loading={bookingLoading}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </RefreshButton>
            </CardHeader>

            <CardContent>
              {bookingLoading ? (
                <EmptyState>
                  <Spinner />
                  <p>Loading events...</p>
                </EmptyState>
              ) : bookings.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </EmptyIcon>
                  <EmptyText>
                    <h3>No Events Yet</h3>
                    <p>
                      Start your journey by booking your first event. Discover
                      amazing experiences waiting for you!
                    </p>
                  </EmptyText>
                  <ExploreButton onClick={() => navigate("/events")}>
                    Explore Events
                  </ExploreButton>
                </EmptyState>
              ) : (
                <BookingList>
                  {bookings.map((booking) => (
                    <BookingItem key={booking.id}>
                      <BookingHeader>
                        <BookingInfo>
                          <BookingIcon>
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                              />
                            </svg>
                          </BookingIcon>
                          <BookingDetails>
                            <h3>{booking.Event?.title || "Unknown Event"}</h3>
                            <BookingMeta>
                              <MetaItem>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                {booking.Event?.location || "Online"}
                              </MetaItem>
                              <MetaItem>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {new Date(booking.Event?.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </MetaItem>
                            </BookingMeta>
                          </BookingDetails>
                        </BookingInfo>

                        <BookingStatus>
                          <StatusBadge status={booking.status}>
                            {booking.status === "confirmed" && (
                              <Dot color="#10b981" />
                            )}
                            {booking.status === "confirmed"
                              ? "Confirmed"
                              : booking.status}
                          </StatusBadge>

                          {booking.status !== "canceled" && (
                            <CancelButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(booking.id);
                              }}
                            >
                              Cancel
                            </CancelButton>
                          )}
                        </BookingStatus>
                      </BookingHeader>
                    </BookingItem>
                  ))}
                </BookingList>
              )}
            </CardContent>
          </BookingsCard>
        </GridContainer>
      </MainContent>
    </PageContainer>
  );
};

export default Profile;
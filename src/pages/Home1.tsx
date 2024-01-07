// Home1.tsx

import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from 'react-icons/bs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import useFirestore from '../hooks/useFirestore';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

function Home1() {
  const { docs } = useFirestore('images');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signup');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  // Create a set of unique email addresses
  const uniqueEmails = new Set(docs.map((doc) => doc.userEmail.toLowerCase()));

  // Calculate total likes
  const totalLikes = docs.reduce((acc, doc) => acc + doc.likes, 0);

  // Create data array based on all unique emails
  const userData = Array.from(uniqueEmails).map((email) => ({
    userEmail: email,
    likes: docs
      .filter((doc) => doc.userEmail.toLowerCase() === email)
      .reduce((acc, doc) => acc + doc.likes, 0),
  }));

  // Count of users who uploaded photos
  const userCount = userData.length;

  // Count of users who have not uploaded photos
  const nonUploaderCount = userCount - 2;

  // Non-firestore data for ad revenue (replace this with your actual data)
  const adRevenueData = [
    { date: '2022-01-01', revenue: 200 },
    { date: '2022-01-08', revenue: 800 },
    // Add more data as needed
  ];

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3 >ADMIN DASHBOARD</h3>
      </div>

      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>Users</h3>
            <BsFillArchiveFill className='card_icon' />
          </div>
          <h1>{uniqueEmails.size}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>Likes</h3>
            <BsFillGrid3X3GapFill className='card_icon' />
          </div>
          <h1>{totalLikes}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>Total Visit</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>{userCount}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>Non-Uploader Users</h3>
            <BsFillBellFill className='card_icon' />
          </div>
          <h1>{nonUploaderCount}</h1>
        </div>
      </div>

      <div className='charts'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            width={500}
            height={300}
            data={adRevenueData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='revenue' stroke='white' activeDot={{ r: 10 }} />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            width={500}
            height={300}
            data={userData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='userEmail' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='likes' fill='white' />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            width={500}
            height={300}
            data={userData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='userEmail' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='likes' stroke='white' activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            width={500}
            height={300}
            data={[
              { name: 'Users with Photos', value: userCount },
              { name: 'Other Users', value: nonUploaderCount },
            ]}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='value' fill='grey' />
          </BarChart>
        </ResponsiveContainer>

        <div className='logout-button' onClick={handleLogout}>
          Logout
        </div>
      </div>
    </main>
  );
}

export default Home1;

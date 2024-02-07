import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/User/Navbar';
import { Box, Text, ChakraProvider, theme, VStack } from '@chakra-ui/react';
import RideCard from '../../components/User/MyRequests';
import LoadingCard from '../../components/layouts/LoadingCard';

const MyRequestRides = () => {
  const [myRequests, setMyRequests] = useState([]);
  const UID = parseInt(localStorage.getItem('UID'));
  const [loading, setLoad] = useState(false);

  useEffect(() => {
    try {
      setLoad(true);
      axios.get(`http://localhost:8000/user/requests/${UID}`).then(response => {
        setLoad(false);
        setMyRequests(response.data);
      });
    } catch (err) {
      console.log(err);
    }
  }, [UID]);

  return (
    <ChakraProvider theme={theme}>
      <Navbar />

      <Box align={'center'}>
        <Text fontWeight={'bold'} fontSize="38px" my="4rem" mx="5rem">
          My Requests Status
        </Text>
        {loading === true ? <LoadingCard /> : null}
        {myRequests.length > 0 ? (
          <Box>
            {/* Affichez les données comme vous le souhaitez ici */}
            {myRequests.map((res, index) => (
              <div key={index}>
                {/* Affichez les détails de chaque demande ici */}
                <p>{`Ride ID: ${res.demanderUID}`}</p>
                <p>{`Publisher ID: ${res.publisherUID}`}</p>
                <p>{`Request Status: ${res.userPhone}`}</p>
                <p>{`Request Status: ${res.status}`}</p>
                <hr />
              </div>
            ))}
          </Box>
        ) : (
          <Text>No requests found.</Text>
        )}
      </Box>
      <br />
      <br />
      <br />
      <br />
      <br />
    </ChakraProvider>
  );
};

export default MyRequestRides;

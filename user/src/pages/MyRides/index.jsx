import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/User/Navbar';
import { Text, ChakraProvider, Box, theme } from '@chakra-ui/react';
import MyRide from '../../components/User/MyRide';
import LoadingCard from '../../components/layouts/LoadingCard';

const MyRides = () => {
  const [allRides, setAllRides] = useState([]);
  const UID = localStorage.getItem('UID');
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        const response = await axios.get(
          `http://localhost:8000/user/${UID}/rides`
        );
        setLoad(false);

        // Vérifiez si la réponse contient des données
        if (response.data) {
          setAllRides(response.data);
        } else {
          // Si la réponse ne contient pas de données
          setAllRides([]);
        }
      } catch (error) {
        setLoad(false);
        setError("Une erreur s'est produite lors du chargement des trajets.");
        console.error(error);
      }
    };

    fetchData();
  }, [UID]);

  return (
    <ChakraProvider theme={theme}>
      <Navbar />

      <Box align={'center'}>
        <Text fontWeight={'bold'} fontSize="38px" my="4rem" mx="5rem">
          My Ongoing Rides
        </Text>

        {loading === true ? <LoadingCard /> : null}

        {Array.isArray(allRides) && allRides.length > 0 ? (
          allRides.map((ride, index) => (
            <MyRide
              key={index}
              UID={ride.UID}
              doj={ride.doj}
              from={ride.from}
              nop={ride.nop}
              price={ride.price}
              to={ride.to}
            />
          ))
        ) : allRides.length === 0 ? (
          <p>Oops! Looks like you have not published any rides.</p>
        ) : null}
      </Box>
      <br />
      <br />
      <br />
      <br />
      <br />
    </ChakraProvider>
  );
};

export default MyRides;

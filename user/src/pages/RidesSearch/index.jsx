import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/User/Navbar';
import RideCard from '../../components/User/RideCard';
import MyRide from '../../components/User/MyRide';
import LoadingCard from '../../components/layouts/LoadingCard';
import {
  ChakraProvider,
  Text,
  theme,
  Box,
  FormControl,
  FormLabel,
  Stack,
  Button,
  Input,
  Heading,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
const RidesSearch = () => {
  const [allRides, setAllRides] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [doj, setDoj] = useState('');
  const [price, setPrice] = useState('');
  const [msg, setMsg] = useState('Please fill the following details');
  const [loading, setLoad] = useState(false);

  const handleFromChange = e => setFrom(e.target.value);
  const handleToChange = e => setTo(e.target.value);
  const handleDojChange = e => setDoj(e.target.value);
  const handlePriceChange = e => setPrice(e.target.value);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoad(true);
        const response = await axios.get(`http://localhost:8000/rides/all`);

        if (isMounted) {
          // Assuming 'doj' is a date string in ISO format (e.g., '2022-02-28T00:00:00.000Z')
          const currentDate = new Date();

          // Filter rides based on expiration status
          const filteredRides = response.data.filter(ride => {
            const rideDate = new Date(ride.doj);
            return rideDate >= currentDate; // Adjust the condition based on your logic
          });

          setAllRides(filteredRides);

          if (response.status === 200) {
            setLoad(false);
            setMsg('Scroll to view rides');
          } else {
            setMsg("Couldn't find rides");
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    return () => {
      // Set isMounted to false when the component is unmounted
      isMounted = false;
    };
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      {/* <Stack spacing={8} mx={'auto'} maxW={'lg'} py={2} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}> Search Rides</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            {msg}
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <form onSubmit={handleSubmit}>
              <FormControl id="publish_ride">
                <HStack>
                  <FormLabel>From</FormLabel>
                  <Input
                    placeholder={'Enter a pick-up point'}
                    id="from"
                    type="text"
                    onChange={handleFromChange}
                  />

                  <FormLabel>To</FormLabel>
                  <Input
                    placeholder={'Enter a drop point'}
                    id="to"
                    type="text"
                    onChange={handleToChange}
                  />
                </HStack>
                <br />
                <HStack>
                  <FormLabel>Date of Journey</FormLabel>
                  <Input
                    placeholder={'Date of Journey'}
                    id="doj"
                    type="date"
                    onChange={handleDojChange}
                  />
                </HStack>
                <br />
                <HStack>
                  <FormLabel>Price per head</FormLabel>
                  <Input
                    placeholder={'Price per head'}
                    id="price"
                    type="text"
                    onChange={handlePriceChange}
                  />
                </HStack>
              </FormControl>
              <br />
              <Stack spacing={10}>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  my={'1rem'}
                  type="submit"
                >
                  Search Ride
                </Button>
              </Stack>
            </form>
            <Stack spacing={10}></Stack>
          </Stack>
        </Box>
      </Stack> */}
      <Box align={'center'}>
        <Text fontWeight={'bold'} fontSize="38px" my="4rem" mx="5rem">
          ALL Rides
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
              // Add a class to style expired rides
              expired={new Date(ride.doj) < new Date()}
            />
          ))
        ) : allRides.length === 0 ? (
          <p>Oops! Looks like you have not published any rides.</p>
        ) : null}
      </Box>
      <br />
      <br />
    </ChakraProvider>
  );
};

export default RidesSearch;

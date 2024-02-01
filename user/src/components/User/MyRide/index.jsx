import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import Card from '../../layouts/Card';
import FadeInUp from '../../Animation/FadeInUp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const MyRide = ({ from, to, nop, price, rideID, doj, UID }) => {
  var color = 'white';
  var statusColor = 'orange.200';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const navigate = useNavigate();

  const redirectReq = async () => {
    onOpen();
  };
  const handleSubmit = async () => {
    console.log('Submitting data:', userName, userPhone, UID);

    try {
      // Vérifiez si les champs sont vides
      if (!userName || !userPhone) {
        // Affichez un message d'erreur si les champs sont vides
        alert('Please enter your name and phone number.');
        return;
      }

      // Envoi des données au backend
      const response = await axios.post(
        'http://localhost:8000/user/submit-request',
        {
          userName,
          userPhone,
          publisherUID: UID, // Inclure l'UID du déposant de la course
          // Autres données que vous pourriez vouloir envoyer
        }
      );

      // Vérifiez la réponse du backend
      if (response.status === 201) {
        // Les données ont été envoyées avec succès
        console.log('Data submitted successfully.');
      } else {
        // Affichez un message d'erreur si l'envoi a échoué
        console.error('Failed to submit data.');
      }

      // Après avoir envoyé les données, fermer le modal
      onClose();
    } catch (error) {
      // Gérez les erreurs liées à l'envoi des données
      console.error('Error submitting data:', error.message);
      // Affichez un message d'erreur à l'utilisateur si nécessaire
      alert('An error occurred while submitting data.');
    }
  };

  return (
    <FadeInUp>
      <Card
        py="3rem"
        my="2rem"
        px="2rem"
        mx={['1rem', '2rem', '3rem', '4rem']}
        width="80vw"
        borderRadius="16px"
        boxShadow=" 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        height={{ xs: '400px', sm: '300px', md: '150px', lg: '150px' }}
        bg={color}
        position="relative"
      >
        <SimpleGrid columns={[1, 2, 3, 4, 5, 6]} spacing="40px">
          <Box
            w="100%"
            bgColor={statusColor}
            textAlign={'center'}
            verticalAlign={'middle'}
            h={'60px'}
            borderRadius={'50px'}
          >
            <Text fontWeight={600} fontSize={['2xl', '3xl', '4xl']}>
              {from}
            </Text>
          </Box>
          <Box
            w="100%"
            bgColor={statusColor}
            textAlign={'center'}
            verticalAlign={'middle'}
            h={'60px'}
            borderRadius={'50px'}
          >
            <Text fontWeight={600} fontSize={['2xl', '3xl', '4xl']}>
              {to}
            </Text>
          </Box>
          <Box align="center">
            <Text fontWeight={'bold'}>Date of Journey:</Text>
            {doj}
          </Box>
          <Box align="center">
            <Text fontSize={'xl'} fontWeight={'bold'}>
              {nop}
            </Text>
            <Text>Seats</Text>
          </Box>
          <Box align="center">
            <b>Price</b>
            <br />
            Rs. {price}
          </Box>
          <Box align="center">
            <Button onClick={redirectReq}>Request Now!!</Button>
          </Box>
        </SimpleGrid>
        <br />
        <br />
        {/* Modal pour la saisie du numéro de téléphone et du nom */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Enter Your Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>Enter your name and phone number:</Text>
              <Input
                placeholder="Your Name"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                mb={4}
              />
              <Input
                placeholder="Your Phone Number"
                value={userPhone}
                onChange={e => setUserPhone(e.target.value)}
              />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Submit
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    </FadeInUp>
  );
};

export default MyRide;

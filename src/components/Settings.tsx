import { Button, Input, useDisclosure } from "@chakra-ui/react";
import React from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,Show, Hide, Fade, ScaleFade, Slide, SlideFade, Collapse
} from "@chakra-ui/react";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'





const Settings = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleTypeClick = () => {
        
        onOpen()
      }

    const type  = ['username','password', 'files']

  return (
    <>
      <div>Settings</div>
      
      <FormControl>
        <FormLabel>Change username</FormLabel>
        <Input />
        <FormHelperText>changing username</FormHelperText>
        <Button>submit</Button>
      </FormControl>
      
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay/>   
        <ModalContent>
            <ModalBody>
                
      <FormControl>
        <FormLabel>Change password</FormLabel>
        <div>**here must be submit with email**</div> 
        <Input />
        <FormHelperText>changing password</FormHelperText>
        <Button>submit</Button>
      </FormControl>

      </ModalBody>
      <ModalFooter>
            <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent> 
      </Modal>
      <Button  onClick={() => handleTypeClick()} >ChangePassword</Button>
      <div>change account photo</div>
    </>
  );
};

export default Settings;

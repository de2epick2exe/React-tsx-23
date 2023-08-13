import { Button, Input, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
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
    
    const { isOpen : isPasswordOpen , onOpen : OnPasswordOpen, onClose: OnPasswordClose } = useDisclosure()
    const { isOpen : isUsernameOpen , onOpen : OnUsernameOpen, onClose: OnUsernameClose } = useDisclosure()
    
    

  return (
    <>
      <div>Settings</div>
      
      
      
      <Modal isOpen={isPasswordOpen} onClose={OnPasswordClose}>
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
            <Button onClick={() => OnPasswordClose()}>Close</Button>
        </ModalFooter>
      </ModalContent> 
      </Modal>
      <Button  onClick={() => OnPasswordOpen()} >ChangePassword</Button>


      <Modal isOpen={isUsernameOpen} onClose={OnUsernameClose}>
        <ModalOverlay/>   
        <ModalContent>
            <ModalBody>
                
            <FormControl>
        <FormLabel>Change username</FormLabel>
        <Input />
        <FormHelperText>changing username</FormHelperText>
        <Button>submit</Button>
      </FormControl>

      </ModalBody>
      <ModalFooter>
            <Button onClick={() => OnUsernameClose()}>Close</Button>
        </ModalFooter>
      </ModalContent> 
      </Modal>
      <Button  onClick={() => OnUsernameOpen()} >ChangeUsername</Button>



      <div>change account photo</div>
    </>
  );
};

export default Settings;

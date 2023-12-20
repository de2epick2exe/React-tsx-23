import { Avatar, Box, Button, Center, Flex, Input, Text, useDisclosure } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
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

  import { Image } from '@chakra-ui/react'
  import {useDropzone} from 'react-dropzone'
import { save_file } from "../unite/Messager_functions";




  
 //// If you want to access file contents you have to use the FileReader API:https://developer.mozilla.org/en-US/docs/Web/API/FileReader  ????






const Settings = () => {
    
    const { isOpen : isPasswordOpen , onOpen : OnPasswordOpen, onClose: OnPasswordClose } = useDisclosure()
    const { isOpen : isUsernameOpen , onOpen : OnUsernameOpen, onClose: OnUsernameClose } = useDisclosure()
    const { isOpen : isAvatarOpen , onOpen : OnAvatarOpen, onClose: OnAvatarClose } = useDisclosure()
    const [avatar, setAvatar] = useState<FileList |any>()
    const dispatch: ThunkDispatch<any, any, any> = useDispatch();
    const data = useSelector((state: RootState) => state.userReducer);
    const url = data.photo
    console.log(url)

    async function save_profile_photo() {
     const res = await save_file(avatar[0])
     console.log(res)
       }

    function Dropzone() {
      const onDrop = useCallback((acceptedFiles: any)  => {
        console.log(acceptedFiles)
        console.log(acceptedFiles[0].type)
        setAvatar(acceptedFiles)
      }, [])
      const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
      const styles = {
        width: "400px",
        height: "300px",
        background: "#8B0000",
        display: "flex",
        'align-items': 'center',
        'justify-content': 'center',
        border: "5px dashed black"
      }
      return (
        <div style={styles} {...getRootProps([
          
        ])}>
          <input {...getInputProps()} />
          {
            isDragActive ?
            
              <p >Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
      )
    }

    const filesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      setAvatar(e.target.files)
 }



  return (
    <>
      <div>Settings</div> 
       <Box m="5" >
      <Flex flexDir='row' >
       <Avatar size='2xl' name={data.username ?? undefined}/>
       <Flex flexDir='column'  justifyContent='space-evenly'>
        <Box ml='5'>
        <Text>{data.username}</Text>         
        <Text> {data.role}</Text>
        </Box>
        </Flex>
        </Flex>
      </Box>
      
      <Button onClick={() => OnAvatarOpen()} >Change Avatar</Button><br/>

      <Modal isOpen={isAvatarOpen} onClose={OnAvatarClose}>
        <ModalOverlay/>   
        <ModalContent>
            <ModalBody>
                
      <FormControl>
        <FormLabel>Change Avatar</FormLabel>
         
        <Input type="file" onChange={e => filesHandler(e)} />
        <FormHelperText>changing profile photo</FormHelperText>
        
        
  



        <Button onClick={save_profile_photo}>Submit</Button>
      </FormControl>
      <Dropzone/>
      </ModalBody>
      <ModalFooter>
            <Button onClick={() => OnAvatarClose()}>Close</Button>
        </ModalFooter>
      </ModalContent> 
      </Modal>
     

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



      
    </>
  );
};

export default Settings;

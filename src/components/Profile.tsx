import React, { useEffect, useRef, useState } from "react";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Grid,
  GridItem,
  InputRightElement,
  Textarea,
  InputGroup,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { user_profile } from "../unite/User_Functions";
import {
  ArrowRightIcon,
  DeleteIcon,
  EditIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import { sendMessage } from "../store/reduses/WS_Slice";

const Profile = () => {
  const data = useSelector((state: RootState) => state.userReducer);
  const messager_store = useSelector(
    (state: RootState) => state.messagerReducer
  );
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const { id } = useParams<{ id?: string }>();
  const [profile_data, Set_Profile_data] = useState<any>();
  const [is_friend_status, set_Is_friend_status] = useState<any>();
  const [isLoading, set_IsLoading] = useState(true);
  const [post_message, set_postMessage] = useState("");

  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin,
    onClose: onCloseLogin,
  } = useDisclosure();
  const get_profile = async () => {
    if (id) {
      const res = await user_profile(parseFloat(id));
      console.log(res);
      Set_Profile_data(res);
    }
  };
  useEffect(() => {
    get_profile();
    get_posts();
  }, []);

  const delete_friend = async () => {
    const message = {
      id: data.id,
      to_delete: profile_data?.id,
      event: "delete_friend",
    };
    dispatch(sendMessage(message));
  };

  const add_friend = async () => {
    const message = {
      id: data.id,
      add_id: profile_data?.id,
      event: "add_friend",
    };
    dispatch(sendMessage(message));
  };

  useEffect(() => {
    profile_data?.status ? set_IsLoading(false) : set_IsLoading(true);
  }, [is_friend_status]);
  const Friend_button = () => {
    if (is_friend_status == "friends_list") {
      return null;
    }
    if (is_friend_status == "waiting_accept" || "hidden_not_accepted") {
      return (
        <Button mt="2" onClick={add_friend}>
          Add Friend
        </Button>
      );
    } else {
      return (
        <Button mt="2" onClick={add_friend}>
          Add Friend
        </Button>
      );
    }

    return null;
    /*
      matched_column
      { matched_column: 'friends_list' }
      */
  };

  const create_post = () => {
    const msg = {
      post: post_message,
      user_id: data.id,
      date: new Date(),
      type: "self",
      event: "create_self_post",
    };
    console.log("create post data:", msg);
    dispatch(sendMessage(msg));
  };

  const get_posts = () => {
    const msg = {
      user_id: data.id,
      event: "get_profile_posts",
    };

    dispatch(sendMessage(msg));
  };

  const Posts_component = () => {
    const [comment, setComment] = useState("");
    const [edit, setEditing] = useState("");
    const [edit_index, setEdit_index] = useState<Number | null>();
    console.log("Profile posts:", messager_store.user_posts);

    const inputComment = (e: any) => {
      e.preventDefault();
      setComment(e.target.value);
    };

    const posts = messager_store.user_posts.map((posts, index) => (
      <Box
        key={index}
        border={"2px solid black"}
        my="5"
        px="2"
        borderRadius="7px"
      >
        <Flex mt="1" justifyContent="space-between">
          <Flex>
            <Avatar
              size="sm"
              name={profile_data?.username}
              src={
                profile_data?.avatar != null
                  ? `http://localhost:8080/img/${profile_data?.avatar}`
                  : `http://localhost:8080/img/default.jpg`
              }
            />
            <Text ml="1">{profile_data?.username}</Text>
          </Flex>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
            />
            <MenuList>
              <MenuItem
                icon={<EditIcon />}
                onClick={(e) =>
                  setEdit_index(edit_index === index ? null : index)
                }
              >
                Edit
              </MenuItem>
              <MenuItem icon={<DeleteIcon />}>Delete</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <Text >{edit_index == index ? (<>edit</>) : (<></>) } </Text>
        <Text borderBottom="2px solid red" my="2">
          {posts?.post}
        </Text>

        <InputGroup mb="2">
          <Textarea
            resize="none"
            minH="4"
            maxH="10"
            value={comment}
            onChange={(e) => inputComment(e)}
          />
          <InputRightElement>
            <Button>
              <ArrowRightIcon />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>
    ));
    return <>{posts}</>;
  };

  const User_info = () => {
    if (data.id !== (id ? parseFloat(id) : null))
      return (
        <Flex flexDir="column">
          <Text as="b">{profile_data?.username}</Text>
          <Text as="kbd">{profile_data?.role}</Text>
          <Button mt="2">Write message</Button>
          <Friend_button />
        </Flex>
      );
    return (
      <>
        <Flex flexDir="column">
          <Text as="b">{profile_data?.username}</Text>
          <Text as="kbd">{profile_data?.role}</Text>
        </Flex>
      </>
    );
  };

  if (profile_data?.status == 404) {
    {
      /**-------------------- if 404 ------------------------------- */
    }
    return <> not found</>;
  } //---------------------- main page ---------------------------------
  else {
    return (
      <Box>
        <Grid templateColumns="repeat(3, 1fr)" gap="1" minH="92vh">
          <GridItem
            m="5"
            border="2px solid red"
            width="13vw"
            padding="3"
            h="43%"
          >
            <Center>
              <Avatar
                size="2xl"
                name={profile_data?.username}
                src={
                  profile_data?.avatar != null
                    ? `http://localhost:8080/img/${profile_data?.avatar}`
                    : `http://localhost:8080/img/default.jpg`
                }
              />
            </Center>
            <br />

            <User_info />
            {/**-------------------- Login Modal------------------------------- */}
            <Modal isOpen={isOpenLogin} onClose={onCloseLogin}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>You mus be logined</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Button variant="ghost" as={Link} to="/login">
                    Login
                  </Button>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onCloseLogin}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </GridItem>
          {/**-------------------- Center column------------------------------- */}
          <GridItem borderX="2px solid red">
            <InputGroup mt="2">
              <Textarea
                resize="none"
                value={post_message}
                onChange={(e) => set_postMessage(e.target.value)}
              />
              <InputRightElement>
                <Button onClick={create_post}>
                  <ArrowRightIcon />
                </Button>
              </InputRightElement>
            </InputGroup>

            <Posts_component />
          </GridItem>
          {/**-------------------- Right column------------------------------- */}
          <GridItem>right bar</GridItem>
        </Grid>
      </Box>
    );
  }
};

export default Profile;

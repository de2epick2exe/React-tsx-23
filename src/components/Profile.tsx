import React, { useEffect, useMemo, useRef, useState } from "react";
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
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import { sendMessage } from "../store/reduses/WS_Slice";
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const data = useSelector((state: RootState) => state.userReducer);
  const ws = useSelector((state: RootState) => state.WS_Slice);
  const messager_store = useSelector(
    (state: RootState) => state.messagerReducer
  );
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const navigate = useNavigate()
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
    connect_to_user_room();
    get_profile();
    get_posts();
  }, [ws.connected && id]);

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

  const connect_to_user_room = () => {
    const msg = {
      room: Number(id),
      event: "connection_to_users_room",
    };
    dispatch(sendMessage(msg));
    console.log("connecting to room:", msg);
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
    set_postMessage("");
  };
  const delete_post = (id: any) => {
    const msg = {
      id: id,
      type: "open",
      event: "delete_self_post",
    };
    console.log("delete post data:", msg);
    dispatch(sendMessage(msg));
  };

  const get_posts = () => {
    const msg = {
      user_id: id,
      event: "get_profile_posts",
    };

    dispatch(sendMessage(msg));
  };

  const Posts_component = () => {
    const [comment, setComment] = useState("");
    const [edited_post, setEdited_post] = useState("");
    const [edit_index, setEdit_index] = useState<Number | null>();
    console.log("Profile posts:", messager_store.user_posts);
    const inputComment = (e: any) => {
      e.preventDefault();
      setComment(e.target.value);
    };
    const turn_editing = (index: any, post: any) => {
      setEdit_index(index);
      setEdited_post(post.post);
    };
    const send_edited = (post: any) => {
      const msg = {
        id: post.id,
        post: edited_post,
        user_id: data.id,
        date: new Date(),
        type: "open",
        event: "update_self_post",
      };
      console.log("update user post:", msg);
      dispatch(sendMessage(msg));
      set_postMessage("");
    };
    const formatDate = (p_date: Date) => {
      const date = new Date(p_date);
      const time = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const dayMonth = date.toLocaleDateString([], {
        day: "numeric",
        month: "short",
      });
      return `${time} ${dayMonth}`;
    };
    const delete_comment = (id: number) => {
      dispatch(
        sendMessage({
          event: "delete_comment",
          type: "profile",
          id: id,
          user_id: data.id,
        })
      );
      setComment("");
    };

    // TODO
    // create a funcs file
    const posts = messager_store.user_posts.map((post, index) => (
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
          {data.id == (id ? parseFloat(id) : null) ? (
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
                    turn_editing(edit_index === index ? null : index, post)
                  }
                >
                  Edit
                </MenuItem>
                <MenuItem
                  icon={<DeleteIcon />}
                  onClick={(e) => delete_post(post.id)}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <></>
          )}
        </Flex>
        {edit_index == index ? (
          <Box>
            <Textarea
              value={edited_post}
              onChange={(e) => setEdited_post(e.target.value)}
            />
            <Button onClick={() => send_edited(post)}>Confirm</Button>
          </Box>
        ) : (
          <Text borderBottom="2px solid red" my="2">
            {post?.post}
          </Text>
        )}

        <Flex direction={"column"}>
          {post.comments.flat().map((cmt) => (
            <span key={cmt.id}>
              <Box p={"1"}>
                <Flex direction={"row"} justifyContent={"space-between"}>
                  <Flex>
                    <Avatar
                      size="sm"
                      name={cmt?.username}
                      src={
                        cmt?.avatar != null
                          ? `http://localhost:8080/img/${cmt?.avatar}`
                          : `http://localhost:8080/img/default.jpg`
                      }
                    />
                    <Text ml={"2"} 
                    _hover={{textDecoration: 'underline'}}
                    cursor={'pointer'}
                    onClick={(e)=>navigate(`/profile/${cmt.user_id}`)}
                    >
                      {cmt.username} </Text>
                    <Text> {formatDate(cmt.date)}</Text>
                  </Flex>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} />
                    <MenuList>
                      <MenuItem onClick={() => delete_comment(cmt.id)}>
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
                <Text ml={"1"}>{cmt.comment}</Text>
              </Box>
            </span>
          ))}
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
        </Flex>
      </Box>
    ));
    return <Box>{posts}</Box>;
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

  const Posting_area = useMemo(() => {
    if (data.id == (id ? parseFloat(id) : null)) {
      const inputPost = (e: any) => {
        e.preventDefault();
        set_postMessage(e.target.value);
      };
      return (
        <>
          <InputGroup mt="2">
            <Textarea
              resize="none"
              value={post_message}
              onChange={(e) => inputPost(e)}
            />
            <InputRightElement>
              <Button onClick={(e) => create_post()}>
                <ArrowRightIcon />
              </Button>
            </InputRightElement>
          </InputGroup>
        </>
      );
    }
    return <></>;
  }, [post_message, set_postMessage]);

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
            {Posting_area}
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

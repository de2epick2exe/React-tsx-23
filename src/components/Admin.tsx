import React, { useEffect, useState } from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

import {
  ban_user,
  get_all_users,
  get_last_online,
  get_last_registered,
  get_users_count,
  get_users_per_day,
  unBan_user,
  user_profile,
} from "../unite/User_Functions";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  SimpleGrid,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Center,
  Box,
} from "@chakra-ui/react";
import { LuBan } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import { PiCaretDoubleUpBold } from "react-icons/pi";
import { notify_all, notify_user } from "../unite/Messager_functions";
import { CiWarning } from "react-icons/ci";
interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  status: string | null;
  avatar: string | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const data = useSelector((state: RootState) => state.userReducer);
  const [users, setUsers] = useState<User[]>([]);
  const [total_users, setTotal_users] = useState<{ USERS_TOTAL: number[] }[]>(
    []
  );
  const [notify_value, setNotifyValue] = useState("");
  const [users_per_day, setUsers_per_day] = useState<
    { USERS_PER_DAY: any[] }[]
  >([]);
  const data_role = "" || null;
  const [last_online, setLast_online] = useState<{ USERS_PER_DAY: any[] }[]>(
    []
  );
  const [last_registered, setLast_registered] = useState<
    { USERS_PER_DAY: any[] }[]
  >([]);
  const [notify_id, setNotify_id] = useState<number | null>(null);
  const [searced_user, setSearched_user] = useState<any>("");
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: OnSearchClose,
  } = useDisclosure();
  const get_users = async () => {
    const response = await get_all_users(data.username, data.token);
    setUsers(response);
  };
  const get_total_count = async () => {
    const response = await get_users_count(data.token);
    console.log(response);
    setTotal_users(response);
  };
  const get_perday_count = async () => {
    const response = await get_users_per_day(data.token);
    console.log(response);
    setUsers_per_day(response);
    console.log("users per day", users_per_day[0]?.USERS_PER_DAY);
  };

  const get_l_o = async () => {
    const response = await get_last_online(data.token);
    setLast_online(response);
  };
  const get_l_r = async () => {
    const response = await get_last_registered(data.token);
    setLast_registered(response);
  };

  const ban = async (id: number, username: string, role: string) => {
    if (role == "ADMIN") {
      console.log("u cant ban this user");
    } else {
      await ban_user(id);
    }
  };
  const un_ban = async (id: number, username: string, role: string) => {
    await unBan_user(id);
  };
  const global_notify = async () => {
    await notify_all(notify_value);
  };
  const target_notify = async () => {
    // await notify_user(notify_id, notify_value);
    console.log("notifyed", notify_id, "val", notify_value);
  };
  const search = async () => {
    const res = await user_profile(searced_user);
    console.log(res);
    setSearched_user(res);
    onSearchOpen();
  };

  useEffect(() => {
    if (data.role !== "ADMIN" || data_role) {
      navigate("/");
    } else {
      get_users();
      get_total_count();
      get_perday_count();
      get_l_o();
      get_l_r();
    }
  }, []);

  //////////////////////////////////
  /*
SETUP STATUS 

NEED ADD IN GLOBAL INFO TABLE PER WEEK, PER DAY LAST
[last online week]/7
[last online per yesterday]
[last registered]/7
 
users sort change or add more sorts


*/
  /////////////////////////////////
  return (
    <>
      {data.role == "ADMIN" ? (
        <Box ml="3">
          <div>admin panel users</div>
          <Flex>
            <TableContainer width={window.innerWidth - 300}>
              <Table>
                <Thead>
                  <Tr>
                    <Th>id</Th>
                    <Th>username</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Status</Th>
                    <Th>Ban</Th>
                    <Th>Notify</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id}>
                      <Th>{user.id}</Th>
                      <Th
                        cursor="pointer"
                        onClick={() => {
                          navigate(`/profile/${user.id}`);
                        }}
                      >
                        <Flex>
                          <Center>
                            <Avatar
                              size="sm"
                              name={user.username}
                              src={
                                user.avatar != null
                                  ? `http://localhost:8080/img/${user.avatar}`
                                  : `http://localhost:8080/img/default.jpg`
                              }
                            />
                          </Center>
                          <Center>
                            <Box ml="1">{user.username}</Box>
                          </Center>
                        </Flex>
                      </Th>
                      <Th>{user.email}</Th>
                      <Th>{user.role}</Th>
                      <Th> {user.status}</Th>
                      <Th>
                        {user.role === "ADMIN" ? (
                          ""
                        ) : user.status === "BANNED" ? (
                          <Button
                            onClick={() => {
                              un_ban(user.id, user.username, user.role);
                            }}
                            background={"green"}
                          >
                            <Icon as={PiCaretDoubleUpBold} />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              ban(user.id, user.username, user.role);
                            }}
                            background={"red"}
                          >
                            <Icon as={LuBan} />
                          </Button>
                        )}
                      </Th>
                      <Th>
                        <Popover>
                          <PopoverTrigger>
                            <Button onClick={() => setNotify_id(user?.id)}>
                              Create notify
                            </Button>
                          </PopoverTrigger>
                          <Portal>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverHeader>
                                Create notify for {user.username}{" "}
                              </PopoverHeader>
                              <PopoverCloseButton />
                              <PopoverBody>
                                <Textarea
                                  onChange={(e) =>
                                    setNotifyValue(e.target.value)
                                  }
                                />
                              </PopoverBody>
                              <PopoverFooter>
                                <Button
                                  colorScheme="blue"
                                  onClick={target_notify}
                                >
                                  Submit
                                </Button>
                              </PopoverFooter>
                            </PopoverContent>
                          </Portal>
                        </Popover>
                      </Th>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Flex>
          <InputGroup mt={2}>
            <InputLeftElement pointerEvents="none">
              <Icon as={IoIosSearch} color="gray.300" />
            </InputLeftElement>
            <Input
              htmlSize={15}
              width="auto"
              placeholder="search user"
              onChange={(e) => setSearched_user(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  search();
                }
              }}
            />
          </InputGroup>

          <Modal isOpen={isSearchOpen} onClose={OnSearchClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              {searced_user?.username == undefined ? (
                <ModalHeader>
                  <Center>
                    <CiWarning style={{ color: 'red', height: '30px' }} />
                  </Center>
                </ModalHeader>
              ) : (
                <ModalHeader>Found User</ModalHeader>
              )}

              <ModalCloseButton />
              {searced_user?.username == undefined ? (
                <Center>
                  <Flex direction="column">
                    <ModalHeader>User not found</ModalHeader>
                  </Flex>
                </Center>
              ) : (
                <ModalBody>
                  <Flex>
                    <Center>
                      <Avatar
                        size="sm"
                        name={searced_user?.username}
                        src={
                          searced_user?.avatar != null
                            ? `http://localhost:8080/img/${searced_user?.avatar}`
                            : `http://localhost:8080/img/default.jpg`
                        }
                      />
                    </Center>
                    <Flex ml="2" direction="column">
                      <p>{searced_user?.username}</p>
                      <p>{searced_user?.role}</p>
                    </Flex>

                    <Box ml="2">
                      <Center>
                        {searced_user?.role === "ADMIN" ? (
                          ""
                        ) : searced_user?.status === "BANNED" ? (
                          <Button
                            onClick={() => {
                              un_ban(
                                searced_user?.id,
                                searced_user?.username,
                                searced_user?.role
                              );
                            }}
                            background={"green"}
                          >
                            <Icon as={PiCaretDoubleUpBold} />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              ban(
                                searced_user?.id,
                                searced_user?.username,
                                searced_user?.role
                              );
                            }}
                            background={"red"}
                          >
                            <Icon as={LuBan} />
                          </Button>
                        )}
                      </Center>
                    </Box>
                  </Flex>
                </ModalBody>
              )}
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={OnSearchClose}
                  variant="ghost"
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/*      ////////////////  Users Statistic    ////////////////////      */}
          <StatGroup>
            <Stat>
              <StatLabel>Users total</StatLabel>
              <StatNumber>{total_users[0]?.USERS_TOTAL}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>online per day</StatLabel>
              <StatNumber>{users_per_day[0]?.USERS_PER_DAY}</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                9.05%
              </StatHelpText>
            </Stat>
          </StatGroup>
          {/* add form field */}
          <Input
            htmlSize={15}
            width="auto"
            value={notify_value}
            onChange={(e) => setNotifyValue(e.target.value)}
          />
          <Button ml="2" onClick={global_notify}>
            notify all users
          </Button>
          <Button ml="2" onClick={target_notify}>
            notify user
          </Button>
        </Box>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Admin;

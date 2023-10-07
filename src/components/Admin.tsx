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
} from "../unite/User_Functions";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
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
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { LuBan } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import { PiCaretDoubleUpBold } from "react-icons/pi";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  status: string | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const data = useSelector((state: RootState) => state.userReducer);
  const [users, setUsers] = useState<User[]>([]);
  const [total_users, setTotal_users] = useState<{ USERS_TOTAL: number[] }[]>(
    []
  );
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
        <>
          <Flex>
            <div>admin panel users</div>
            <TableContainer width={window.innerWidth / 1.5}>
              <Table>
                <Thead>
                  <Tr>
                    <Th>id</Th>
                    <Th>username</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Status</Th>
                    <Th>Ban</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id}>
                      <Th>{user.id}</Th>
                      <Th>{user.username}</Th>
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
                            background={'green'}
                          >
                            <Icon as={PiCaretDoubleUpBold}  />
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
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Flex>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={IoIosSearch} color="gray.300" />
            </InputLeftElement>
            <Input htmlSize={15} width="auto" placeholder="search user" />
          </InputGroup>
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
          <Button>notify all users</Button>
          <Button>notify user</Button>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Admin;

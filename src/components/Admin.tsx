import React, { useEffect, useState } from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

import { get_all_users } from "../unite/User_Functions";
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

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const data = useSelector((state: RootState) => state.userReducer);
  const [users, setUsers] = useState<User[]>([]);
  const data_role = "" || null;

  const get_users = async () => {
    const response = await get_all_users(data.username, data.token);
    setUsers(response);
  };

  const ban = async (id: number, username: string) => {
    console.log(username, "banned user with id", id);
  };

  useEffect(() => {
    if (data.role !== "ADMIN" || data_role) {
      navigate("/");
    } else {
      get_users();
    }
  }, []);

  return (
    <>
      {data.role == "ADMIN" ? (
        <>
          <Flex >
            <div>admin panel</div>
            <div>users</div>
            <TableContainer width={window.innerWidth/1.5}>
            <Table>
                    <Thead>
                      <Tr>
                        <Th isNumeric>id</Th>
                        <Th>username</Th>
                        <Th>Email</Th>
                        <Th>Role</Th>
                        <Th>Status</Th>
                        <Th>Ban</Th>
                      </Tr>
                    </Thead><Tbody>
              {users.map((user) => (
                
                    <Tr key={user.id}>
                        <Th>{user.id}</Th>
                        <Th>{user.username}</Th>
                        <Th>{user.email}</Th>
                        <Th>{user.role}</Th>
                        <Th> Offline</Th>
                        <Th><Button
                        onClick={() => {
                          ban(user.id, user.username);
                        }}
                        background={"red"}
                      >
                        <Icon as={LuBan} />
                      </Button>
                      </Th> 
                     </Tr>
                 ))}
              </Tbody>
              </Table>
            </TableContainer>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={IoIosSearch} color="gray.300" />
              </InputLeftElement>
              <Input htmlSize={15} width="auto" placeholder="search user" />
            </InputGroup>
          </Flex>
          <StatGroup>
            <Stat>
              <StatLabel>Users total</StatLabel>
              <StatNumber>345,670</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>online per day</StatLabel>
              <StatNumber>45</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                9.05%
              </StatHelpText>
            </Stat>
          </StatGroup>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Admin;

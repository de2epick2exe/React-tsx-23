import React, { useEffect, useState } from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

import { get_all_users, get_users_count, get_users_per_day } from "../unite/User_Functions";
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
  const [total_users, setTotal_users] = useState<{ USERS_TOTAL: number[] }[]>([])
  const [users_per_day, setUsers_per_day] = useState<{ USERS_PER_DAY: any[] }[]>([])
  
  const data_role = "" || null;

  const get_users = async () => {
    const response = await get_all_users(data.username, data.token);
    setUsers(response);
  };
  const get_total_count =async () => {
    const response = await get_users_count(data.token);
    console.log(response)
    setTotal_users(response);
    
  }
  const get_perday_count =async () => {
    const response = await get_users_per_day(data.token);
    console.log(response)
    setUsers_per_day(response);
    console.log("users per day", users_per_day[0]?.USERS_PER_DAY)
  }

  const ban = async (id: number, username: string, role: string) => {
    if(role == 'ADMIN'){ console.log( ' u cant ban this user')}
    else{
    console.log(username, "banned user with id", id);
  }
  };




  useEffect(() => {
    if (data.role !== "ADMIN" || data_role) {
      navigate("/");
    } else {
      get_users();
      get_total_count()
      get_perday_count()
    }
  }, []);
 
//////////////////////////////////
/*
online per day
  
SETUP STATUS 

NEED ADD IN GLOBAL INFO TABLE PER WEEK, PER DAY LAST

REDIS ARRAY WITH ID ONLINE 
*/
/////////////////////////////////
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
                        <Th>
                          {user.role == 'ADMIN'? "" :
                          <Button
                        onClick={() => {
                          ban(user.id, user.username, user.role);
                        }}
                        background={"red"}>
                          
                        <Icon as={LuBan} />
                      </Button>
                      }
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
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Admin;

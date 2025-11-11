import _ from "lodash";

import * as api from "../../util/api";
import { useQuery } from "@tanstack/react-query";
import { ENDPOINT } from "../../util/constant";
import moment from "moment";



const getBooking = async (member_id, page, search,status,type,token) => {
  try {
  console.log('\x1b[32m%s\x1b[0m', member_id, page, search,status,type,token, '---------------------- member_id ---------------------');
  
  
  const apiRequestObject = {
      path: `${
        ENDPOINT.get_booking_details + member_id
      }?page=${page}&type=${type}&status=${status}`,

      body: {},
      Token: token,
    };
    const response = await api.javascriptGet(apiRequestObject);
    console.log('\x1b[36m%s\x1b[0m', response, '---------------------- apiRequestObject ---------------------');


   return response;
  } catch (error) {
   
  }
};
 const fetchFacilities = async (token) => {
    try {
      const summeryObject = { path: ENDPOINT.get_facility,body:{},Token: token };
        const response = await api.javascriptGet(summeryObject);
        
        if (response.status) {
         return response
        }
    } catch (error) {
        console.log(error);
    }
  };
export const useBooking = (page, search, status,type, userData) => {
  const token = userData?.data?.token;
  const member_id = userData?.data?.data?.[0]?.MemberID;
  
  const bookingQuery = useQuery({
    queryKey: ["booking", member_id, page , search, status,type, token],
    queryFn: () => getBooking(member_id, page, search,status,type, token),
    // enabled: false,
    retry: 2,
    refetchOnWindowFocus: true,
    
  });
  const facilityQuery = useQuery({
    queryKey: ["Facilities",],
    queryFn: () => fetchFacilities(token),
    enabled: true,
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  });



  return { bookingQuery,facilityQuery};
};

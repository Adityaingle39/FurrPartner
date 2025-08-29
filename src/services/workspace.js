import React, {useContext, useReducer} from 'react';
import {AppContext} from './states';
import { logViewAd } from '../utils/analytics';

export function useWorspaceState() {
  const context = useContext(AppContext);

  if (!context) {
    // Return a default state to prevent crashes if context is not available
    return {
      newWorkspace: {},
      defaultWorkspace: {},
      workspacesData: [],
      setWorkspaces: () => {},
      setWorkspaceId: () => {},
      setDesignationName: () => {},
      setAbout: () => {},
      setWorkplaceName: () => {},
      setCollaboratorId: () => {},
      setServiceId: () => {},
      setAddress: () => {},
      setTown: () => {},
      setPincode: () => {},
      setState: () => {},
      setEducation: () => {},
      setExpertise: () => {},
      setWorkplaceTime: () => {},
      setCreatedBy: () => {},
      setUploadImages: () => {},
      setServices: () => {},
    };
  }

  const [state, dispatch] = context;
  const dbWorkspaceData = state?.workspaces;

  let returnData = {
    id:null,
    workspaceId: null,
    designationName: null,
    about: null,
    workplaceName: null,
    collaboratorId: null,
    serviceId: null,
    address: null,
    town: null,
    pincode: null,
    state: null,
    education: null,
    expertise: null,
    workplaceTime: null,
    createdBy: null,
    uploadImages: null,
    workspaceImages: [],
    services: null,
    new: false,
    latitude: null,
    longitude: null,
    vacation: false,
    experience:null,
    phone:null
  };

  let workspaceData = Object.assign({}, dbWorkspaceData.filter(o => o.default == true)[0]);
  let newWorkspaceData = dbWorkspaceData.filter(o => o.new == true);

  return {
    newWorkspace: newWorkspaceData.length > 0 ? newWorkspaceData[0] : returnData,
    defaultWorkspace: dbWorkspaceData.filter(o => o.default == true)[0],
    workspacesData: dbWorkspaceData.filter(o => !('new' in o)),
    setWorkspaces: data => {
      dispatch({type: 'workspaces', payload: data});
    },
    setWorkspaceId: id => {
      workspaceData.workspaceId = id;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setDesignationName: dName => {
      workspaceData.designationName = dName;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setAbout: about => {
      workspaceData.about = about;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setWorkplaceName: wName => {
      workspaceData.workplaceName = wName;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setCollaboratorId: cId => {
      workspaceData.collaboratorId = cId;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setServiceId: sId => {
      workspaceData.serviceId = sId;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setAddress: address => {
      workspaceData.address = address;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setTown: town => {
      workspaceData.city = town;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setPincode: pincode => {
      workspaceData.pincode = pincode;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setState: state => {
      workspaceData.service = service;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setEducation: education => {
      workspaceData.education = education;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setExpertise: expertise => {
      workspaceData.expertise = expertise;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setWorkplaceTime: workplaceTime => {
      workspaceData.workplaceTime = workplaceTime;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setCreatedBy: createdBy => {
      workspaceData.createdBy = createdBy;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setUploadImages: uploadImages => {
      workspaceData.uploadImages = uploadImages;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
    setServices: services => {
      workspaceData.services = services;
      dispatch({type: 'workspaces', payload: workspaceData});
    },
  };
}

import React from 'react';
import HomeView from './Home.view.vrn';
import { useHomeLogic } from './Home.logic';

export default function Home() {
  const { state, actions } = useHomeLogic();
  
  return <HomeView state={state} actions={actions} />;
}
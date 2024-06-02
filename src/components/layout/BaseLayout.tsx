import React from 'react';
import {Layout, Menu, theme} from 'antd';
import {useAuth} from "../../hooks/AuthContext.tsx";

const {Header, Content, Footer} = Layout;

const items = [
  {
    key: 'logout',
    label: 'Logout',
  }
];

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = (
  {
    children,
  }) => {
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const auth = useAuth();

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Header style={{display: 'flex', alignItems: 'center'}}>
        <div className="demo-logo"/>
        <Menu
          theme="dark"
          mode="horizontal"

          defaultSelectedKeys={[]}
          items={items}
          onClick={(item) => {
            switch (item.key) {
              case 'settings':
                // navigate('/settings');
                break;
              case 'logout':
                auth.updateToken('');
                window.location.href = '/login';
                break;
            }
          }}
          style={{flex: 1, minWidth: 0, justifyContent: 'right'}}
        />
      </Header>
      <Content style={{padding: '0 48px', marginTop: '16px'}}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{textAlign: 'center'}}>
        Tikk.in ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default BaseLayout;

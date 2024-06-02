import React, {useCallback, useState} from 'react';
import {Card, Flex, Input} from 'antd';
import {SendOutlined} from "@ant-design/icons";
import {validateUrl} from "../../utils/url.ts";
import LinksTable from "../../components/links/LinksTable.tsx";
import useApi from "../../context/ApiContext.tsx";

const {Search} = Input;

const MainPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [reloadTable, setReloadTable] = useState(0);
  const api = useApi();

  const reload = useCallback(() => {
    setReloadTable(new Date().getTime());
  }, []);

  return (
    <>
      <Flex vertical>
        <Flex justify={"center"}>
          <div style={{width: '50%'}}>
            <Search addonBefore={<SendOutlined/>} placeholder="Enter Long URL" size="large" loading={loading}
                    enterButton={"Shorten!"}
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                    onSearch={(value) => {
                      setLoading(true);
                      value = value.trim();
                      if (!value.startsWith('http://') && !value.startsWith('https://')) {
                        value = `https://${value}`;
                      }
                      if (!validateUrl(value)) {
                        console.error('Invalid URL');
                        // show error
                        return;
                      }

                      api.post('/v1/links', {target_url: value})
                        .then((result) => {
                          console.log('link created', result.data);
                          reload();
                          setInputValue('');
                        }).finally(() => {
                        setLoading(false);
                      });
                    }}/>
          </div>
        </Flex>
        <Flex justify="center" style={{marginTop: '36px'}}>
          <div style={{minWidth: '1000px', width: '50%'}}>
            <Card style={{width: '100%'}}>
              <LinksTable triggerReload={reloadTable}/>
            </Card>
          </div>
        </Flex>
      </Flex>
    </>
  );
};

export default MainPage;

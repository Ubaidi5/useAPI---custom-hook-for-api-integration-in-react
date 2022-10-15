import { useState } from "react";
import APIS from "./index";

type mutate = (body?: any, params?: any) => Promise<any>;

const useAPI = (query: any): [mutate, boolean] => {
  const [loading, toggleLoading] = useState(false);

  const mutate = async (body: any, params: any) => {
    try {
      toggleLoading(true);
      const res = await query(body, params);
      return res;
    } catch (err) {
      throw err;
    } finally {
      toggleLoading(false);
    }
  };

  return [mutate, loading];
};

const errorHandler = (error: any) => {
  if (typeof error == "string") {
    return error;
  } else if (error.response) {
    return error.response.data;
  } else if (error.message) {
    return `${error.message}`;
  } else {
    return "Something went wrong";
  }
};

export { useAPI, APIS, errorHandler };

const APIs = {
  checkStore: (body: { store_name: string }) => {
    return axios.post(`${url}/check_store`, body);
  },
  updateFont: (body: { store: string; font_enable: boolean }) => {
    return axios.post(`${url}/update_fonts`, body);
  },
  checkScript: (body: { instance_id: string; store: string }) => {
    return axios.post(`${url}/check_script`, body);
  },
  getStoreInstance: (body: any) => {
    return axios.post(`${url}/get_store_instance`, body);
  },
  getStoreFont: (body: any) => {
    return axios.post(`${url}/get_store_font`, body);
  },
};

//
import type { NextPage } from "next";
import Head from "next/head";
import { Row, Col, Divider, message, Button } from "antd";
import FAQs from "../src/component/faq";
import SwitchWrapper from "../src/component/input/switch";
import { useAPI, errorHandler, APIS } from "../src/apis/config";
import { useEffect, useState } from "react";

type Props = {
  fontEnable: boolean;
  setFontEnable: (val: boolean) => void;
};

const Home: NextPage<Props> = ({ fontEnable, setFontEnable }) => {
  const [updateFont, updateFontLoading] = useAPI(APIS.updateFont);

  const handleUpdateFont = async (status: boolean) => {
    const store = new URL(window.location.href).searchParams.get("siteUrl");
    try {
      await updateFont({
        store: store,
        font_enable: status,
      });
    } catch (err) {
      message.error(errorHandler(err));
    }
  };

  return (
    <div>
      <Head>
        <title>Wix Google Font</title>
        <meta name="description" content="Google Fonts - Hosted in EUROPE" />
      </Head>

      <main className="page">
        <div className="card-1">
          <Row align="middle">
            <Col>
              <img
                src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/images/google-font-1.svg`}
                alt="google-font"
                style={{ margin: "0 16px 0 12px", width: 58 }}
              />
            </Col>
            <Col>
              <div className="heading large">
                Google Fonts - Hosted in EUROPE
              </div>
              <div className="text">
                The DSGVO and GDPR compliant solution for google fonts.
              </div>
            </Col>
          </Row>
        </div>
        <br />

        <Row gutter={[16, 0]}>
          <Col span={12}>
            <div className="card-1">
              <div className="heading">
                Make Google fonts legal for EU - Usage
              </div>
              <div className="text">
                This cuts the connection to Google fonts USA and replaces Google
                fonts with fonts stored in Germany.
              </div>
              <Divider
                style={{ margin: "12px 0 16px 0", backgroundColor: "#B6C1CD" }}
              />
              <Row justify="space-between" align="middle">
                <Col>
                  <div className="text large">
                    Host your Google fonts in europe (GDPR Compliant):
                  </div>
                </Col>

                <Col>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      width: 220,
                      height: 48,
                      boxShadow:
                        "0px 2px 1px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25)",
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ color: "red" }}>OFF</div>
                    <SwitchWrapper
                      checked={fontEnable}
                      loading={updateFontLoading}
                      onChange={(checked) => {
                        setFontEnable(checked);
                        handleUpdateFont(checked);
                      }}
                    />
                    <div style={{ color: "green" }}>ON</div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          <Col span={12}>
            <div className="card-1">
              <div className="heading">FAQ</div>
              <div className="text">
                Questions and answers why Google Fonts violates applicable EU
                law.
              </div>
              <Divider
                style={{ margin: "12px 0 16px 0", backgroundColor: "#B6C1CD" }}
              />
              <FAQs />
            </div>
          </Col>
        </Row>
      </main>
    </div>
  );
};

export default Home;

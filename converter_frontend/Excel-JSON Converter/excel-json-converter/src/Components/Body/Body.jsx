import React, { useState, useCallback, useEffect } from "react";
import useStyles from "./bodyStyles";
import { Container, Typography, Button } from "@material-ui/core";
import { FilePicker } from "react-file-picker";
import Dropzone, { useDropzone } from "react-dropzone";
import bodyStyles from "./bodyStyles.css";
import { Link, useNavigate } from "react-router-dom";
import { uuid } from "uuidv4";
import ApiService from "../../http-common";
import httpCommon from "../../http-common";
import UploadedFile from "./UploadedFiles/UploadedFile";
import { saveAs } from "file-saver";
import ConfirmUpdatePopup from "./ConfirmUpdatePopup/ConfirmUpdatePopup";
import * as JSZip from "jszip";
import { AiOutlineCloudUpload } from "react-icons/ai"

const Body = ({
  settings,
  files,
  setFiles,
  percentages,
  setPercentages,
  counters,
  setCounters,
  rules
}) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
  } = useDropzone({ onDrop });
  const [fileRejected, setFilesRejected] = useState(0);

  const [allFilesConverted, setAllFilesConverted] = useState(0);
  const [updateStorage , setUpdateStorage] = useState(false);
  const [confirmUpdatePopup , setConfirmUpdatePopup] = useState(0)
  const [confirmSingleUpdatePopup, setConfirmSingleUpdatePopup] = useState(0)

  const onSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (percentages.length == 0) {
      setAllFilesConverted(0);
    }

    let counter = 0;
    let counter2 = 0;

    if (percentages.length > 0) {
      percentages.map((file) => {
        if (file.percentage != 100) {
          counter = -1;
          setAllFilesConverted(0);
        } else if (file.percentage == 100) {
          counter2++;
        }
      });
    }

    if (counter2 == percentages.length && percentages.length > 0) {
      counter = 2;
    }

    if (counter != -1 && counter != 0 && percentages.length > 0) {
      setAllFilesConverted(1);
    }

  }, [percentages]);

  useEffect(() => {
    var originFileChanged = 0;
    var counter = 0;
    let tempPercents = [...percentages];
    let tempCounters = [...counters];
    let tempFiles = [...files];

    files.map((file) => {

      if (
        (JSON.stringify(file.originFile) !== JSON.stringify(settings[0].originFile) ||
        JSON.stringify(file.targetFile) !== JSON.stringify(settings[1].targetFile) ||
          file.multipleFileOutput !== settings[2].multipleFileOutput) &&
        file.uploaded == true
      ) {

        for (let i = 0; i < tempFiles.length; i++) {
          if (tempFiles[i].key === file.key) {
            tempFiles.splice(i, 1);
            acceptedFiles.splice(i, 1);
            break;
          }
        }

        for (let i = 0; i < tempPercents.length; i++) {
          if (tempPercents[i].file === file.key) {
            tempPercents.splice(i, 1);
            break;
          }
        }

        for (let i = 0; i < tempCounters.length; i++) {
          if (tempCounters[i].file === file.key) {
            tempCounters.splice(i, 1);
            break;
          }
        }
      } else {
        file.originFile = settings[0].originFile;
        file.targetFile = settings[1].targetFile;
        file.multipleFileOutput = settings[2].multipleFileOutput;
      }
    });

    setPercentages(tempPercents);
    setCounters(tempCounters);
    setFiles(tempFiles);
  }, [settings]);

  function onDrop(acceptedFiles) {
    setFilesRejected(0);

    let counter = 0;

    acceptedFiles.map((file) => {
      for (let i = 0; i < settings[0].originFile.length; i++) {
        if (
          file.name.substr(file.name.lastIndexOf(".")) ===
          settings[0].originFile[i]
        ) {
          files.push(file);
          counter++;
          break;
        } else if (counter < acceptedFiles.length) {
          setFilesRejected(1);
        }
      }
    });

    let temp = [...percentages];
    let tempCounters = [...counters];

    acceptedFiles.map((file) => {
      file.key = uuid();
      file.uploaded = false;
      file.targetFile = settings[1].targetFile;
      file.originFile = settings[0].originFile;
      file.multipleFileOutput = settings[2].multipleFileOutput;

      temp.push({ file: file.key, percentage: 0 });

      tempCounters.push({ file: file.key, numRows: 0 });
    });

    setFiles(files);
    setPercentages(temp);
    setCounters(tempCounters);
  }

  const handleRemoveFile = (fileKey) => () => {
    let tempFiles = [...files];

    for (let i = 0; i < tempFiles.length; i++) {
      if (tempFiles[i].key === fileKey) {
        tempFiles.splice(i, 1);
        acceptedFiles.splice(i, 1);
        break;
      }
    }

    let index = 0;
    let tempPercents = [...percentages];
    percentages.map((percentFile) => {
      if (percentFile.file == fileKey) {
        tempPercents.splice(index, 1);
      }
      index++;
    });

    let countersIndex = 0;
    let tempCounters = [...counters];
    counters.map((counterFile) => {
      if (counterFile.file == fileKey) {
        tempCounters.splice(countersIndex, 1);
      }
      countersIndex++;
    });

    setPercentages(tempPercents);
    setCounters(tempCounters);
    setFiles(tempFiles);
  };

  function intersperse(arr, sep) {
    if (arr.length === 0) {
      return [];
    }

    return arr.slice(1).reduce(
      function(xs, x, i) {
        return xs.concat([sep, x]);
      },
      [arr[0]]
    );
  }

  function clean(object) {
    Object.entries(object).forEach(([k, v]) => {
      if (v && typeof v === "object") {
        clean(v);
      }
      if (
        (v && typeof v === "object" && !Object.keys(v).length) ||
        v === null ||
        v === undefined ||
        v === "" ||
        v === " " ||
        v.length === 0
      ) {
        if (Array.isArray(object)) {
          object.splice(k);
        } else {
          delete object[k];
        }
      }
    });
    return object;
  }

  const handlePopup = () => {

    if(files.length > 0){
      setFilesRejected(0)
      setConfirmUpdatePopup(1)
    }else{
      setFilesRejected(2)
    }
    
  }

  const handleFileUpload = (updateStorage) => {
    files.map((file) => {

      if (file.multipleFileOutput == "0") {
        let index = 0;
        let counter = 0;
        percentages.map((percentFile) => {
          if (percentFile.file == file.key) {
            index = counter;
          }

          counter++;
        });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        formData.append("fileKey", file.key);
        formData.append("updateStorage" , updateStorage ? true : false)

        console.log(formData)

        ApiService.upload(formData, file.name, file.key, {
          headers: {
            "content-type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            let completed = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            let tempPercents = [...percentages];
            tempPercents[index].percentage = completed;
            setPercentages(tempPercents);
          },
        }).then((res) => {
          file.uploaded = true;
          let tempPercents = [...percentages];
          tempPercents[index].percentage = 100;
          setConfirmUpdatePopup(0)

          setPercentages(tempPercents);
        });
      }

      if (file.multipleFileOutput == "1") {
        let percentageIndex = 0;
        let percentageCounter = 0;

        percentages.map((percentFile) => {
          if (percentFile.file == file.key) {
            percentageIndex = percentageCounter;
          }

          percentageCounter++;
        });

        let countersIndex = 0;
        let countersCounter = 0;
        counters.map((counterFile) => {
          if (counterFile.file == file.key) {
            countersIndex = countersCounter;
          }

          countersCounter++;
        });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        formData.append("fileKey", file.key);
        formData.append("updateStorage" , updateStorage ? true : false)

        

        ApiService.uploadToMultipleJSON(formData, file.name, file.key, {
          headers: {
            "content-type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            let completed = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            let tempPercents = [...percentages];
            tempPercents[percentageIndex].percentage = completed;
            setPercentages(tempPercents);
          },
        }).then((res) => {
          file.uploaded = true;
          let tempPercents = [...percentages];
          tempPercents[percentageIndex].percentage = 100;
          setPercentages(tempPercents);

          let tempCounters = [...counters];
          tempCounters[countersIndex].numRows = res.data;
          setConfirmUpdatePopup(0)
          setCounters(tempCounters);
        });
      }
    });
  };

  const handleSingleFileUpload = (fileKey , updateStorage) => {
    if (settings[2].multipleFileOutput == "0") {
      files.map((file) => {
        let index = 0;
        let counter = 0;
        percentages.map((percentFile) => {
          if (percentFile.file == file.key) {
            index = counter;
          }

          counter++;
        });

        if (file.key == fileKey) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("fileName", file.name);
          formData.append("fileKey", file.key);
          formData.append("updateStorage" , updateStorage ? true : false)

          ApiService.upload(formData, {
            headers: {
              "content-type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              let completed = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              let tempPercents = [...percentages];
              tempPercents[index].percentage = completed;
              setPercentages(tempPercents);
            },
          }).then((res) => {
            file.uploaded = true;
            let tempPercents = [...percentages];
            tempPercents[index].percentage = 100;
            setConfirmSingleUpdatePopup(0)
            setPercentages(tempPercents);
          });
        }
      });
    }

    if (settings[2].multipleFileOutput == "1") {
      files.map((file) => {
        let index = 0;
        let counter = 0;
        percentages.map((percentFile) => {
          if (percentFile.file == file.key) {
            index = counter;
          }

          counter++;
        });

        let countersIndex = 0;
        let countersCounter = 0;
        counters.map((counterFile) => {
          if (counterFile.file == file.key) {
            countersIndex = countersCounter;
          }

          countersCounter++;
        });

        if (file.key == fileKey) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("fileName", file.name);
          formData.append("fileKey", file.key);
          formData.append("updateStorage" , updateStorage ? true : false)

          ApiService.uploadToMultipleJSON(formData, {
            headers: {
              "content-type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              let completed = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              let tempPercents = [...percentages];
              tempPercents[index].percentage = completed;
              setPercentages(tempPercents);
            },
          }).then((res) => {
            file.uploaded = true;
            let tempPercents = [...percentages];
            tempPercents[index].percentage = 100;
            setPercentages(tempPercents);

            let tempCounters = [...counters];
            tempCounters[countersIndex].numRows = res.data;
            setConfirmSingleUpdatePopup(0)
            setCounters(tempCounters);


          });
        }
      });
    }
  };

  const handleFileDownload = (file) => {
    if (
      settings[1].targetFile == ".json" &&
      settings[2].multipleFileOutput == "0"
    ) {
      ApiService.download(
        file.key +
          "converted-" +
          file.name.substr(0, file.name.lastIndexOf(".")) +
          settings[1].targetFile,
        {
          onDownloadProgress: (progressEvent) => {
            let completed = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          },
        }
      )
        .then((response) => {
          const url = window.URL.createObjectURL(
            new Blob([JSON.stringify(clean(response.data))])
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            file.name.substr(0, file.name.lastIndexOf(".")) +
              settings[1].targetFile
          ); 
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => console.error(err));
    }

    if (
      settings[1].targetFile == ".json" &&
      settings[2].multipleFileOutput == "1"
    ) {
      let countersIndex = 0;
      let countersCounter = 0;
      counters.map((counterFile) => {
        if (counterFile.file == file.key) {
          countersIndex = countersCounter;
        }

        countersCounter++;
      });

      let percentageIndex = 0;
      let percentageCounter = 0;

      percentages.map((percentFile) => {
        if (percentFile.file == file.key) {
          percentageIndex = percentageCounter;
        }

        percentageCounter++;
      });

      var zip = new JSZip();
      

      for (let i = 1; i <= counters[countersIndex].numRows; i++) {
        

        ApiService.download(
          file.key +
            "converted-" +
            file.name.substr(0, file.name.lastIndexOf(".")) +
            "-" +
            i +
            settings[1].targetFile,
          {
            onDownloadProgress: (progressEvent) => {
              let completed = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              let tempPercents = [...percentages];
              tempPercents[percentageIndex].percentage = completed;
              setPercentages(tempPercents);
            },
          }
        )
          .then((response) => {
            let blob = new Blob([JSON.stringify(clean(response.data))]);
            zip.file(
              file.name.substr(0, file.name.lastIndexOf(".")) +
                "-" +
                i +
                settings[1].targetFile,
              blob
            );
          })
          .then(() => {
            var entries = 0;
            zip.forEach((function (relativePath, file){
              console.log("iterating over", relativePath);
              entries++
          }));

            if (entries == counters[countersIndex].numRows) {
              zip.generateAsync({ type: "blob" }).then(function(content) {
                saveAs(content, "converted.zip");
              });
            }
          })
          .catch((err) => console.error(err));
      }
    }
  };

  const handleDownloadAllFiles = () => {
    let counter = 0;

    if (
      settings[1].targetFile == ".json" &&
      settings[2].multipleFileOutput == "0"
    ) {
      var zip = new JSZip();

      files.map((file) => {
        let percentageIndex = 0;
        let percentageCounter = 0;

        percentages.map((percentFile) => {
          if (percentFile.file == file.key) {
            percentageIndex = percentageCounter;
          }

          percentageCounter++;
        });

        ApiService.download(
          file.key +
            "converted-" +
            file.name.substr(0, file.name.lastIndexOf(".")) +
            settings[1].targetFile,
          {
            onDownloadProgress: (progressEvent) => {
              let completed = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              let tempPercents = [...percentages];
              tempPercents[percentageIndex].percentage = completed;
              setPercentages(tempPercents);
            },
          }
        )
          .then((response) => {
            let blob = new Blob([JSON.stringify(clean(response.data))]);
            zip.file(
              file.name.substr(0, file.name.lastIndexOf(".")) +
                settings[1].targetFile,
              blob
            );
            counter++;
          })
          .then(() => {
            if (counter == files.length) {
              zip.generateAsync({ type: "blob" }).then(function(content) {
                saveAs(content, "converted.zip");
              });
            }
          })
          .catch((err) => console.error(err));
      });
    }

    if (
      settings[1].targetFile == ".json" &&
      settings[2].multipleFileOutput == "1"
    ) {
      var zip = new JSZip();
      let totalFiles = 0;
      let fileCounter = 0;

      files.map((file) => {
        var folder = zip.folder(
          "converted-" + file.name.substr(0, file.name.lastIndexOf("."))
        );

        let countersIndex = 0;
        let countersCounter = 0;
        counters.map((counterFile) => {
          if (counterFile.file == file.key) {
            countersIndex = countersCounter;
            totalFiles += counters[countersIndex].numRows;
          }

          countersCounter++;
        });

        for (let i = 1; i <= counters[countersIndex].numRows; i++) {
          ApiService.download(
            file.key +
              "converted-" +
              file.name.substr(0, file.name.lastIndexOf(".")) +
              "-" +
              i +
              settings[1].targetFile,
            {
              onDownloadProgress: (progressEvent) => {
                let completed = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
              },
            }
          )
            .then((response) => {
              let blob = new Blob([JSON.stringify(clean(response.data))]);
              folder.file(
                file.name.substr(0, file.name.lastIndexOf(".")) +
                  settings[1].targetFile +
                  "-" +
                  i,
                blob
              );
              fileCounter++;
            })
            .then(() => {
              if (fileCounter == totalFiles) {
                console.log(fileCounter + "             " + totalFiles)
                zip.generateAsync({ type: "blob" }).then(function(content) {
                  saveAs(content, "converted.zip");
                });
              }
            })
            .catch((err) => console.error(err));
        }
      });
    }
  };

  const handleClearFiles = () => {
    let tempFiles = [...files];
    let tempPercents = [...percentages];
    let tempCounters = [...counters];

    tempFiles.splice(0, tempFiles.length);
    tempPercents.splice(0, tempPercents.length);
    tempCounters.splice(0, tempCounters.length);

    setFiles(tempFiles);
    setPercentages(tempPercents);
    setCounters(tempCounters);
  };

  const handleNavigate = () => {
    navigate("/settings", {
      state: { percentages: percentages, files: files },
    });
  };

  return (
    <Container style={{ width: "90vw", maxWidth: "85vw" }}>
      <div className={classes.toolbar} />
      <Typography className={classes.title} variant="h2">
        Choose Files
      </Typography>
      <br />
      <br />
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <form
            method="get"
            type="file"
            action="#"
            multiple
            id="#"
            onChange={onDrop}
          >
            <div className={classes.dropzone} {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <div
                  className="onDragOver"
                  style={{ height: "100%", pointerEvents: "none" }}
                >
                  <div
                    className={classes.text}
                    style={{ transform: "translateY(100px)" }}
                  >
                    Drop Your Files Here
                  </div>
                  <div
                    className={classes.subText}
                    style={{ transform: "translateY(120px)" }}
                  >
                    Dropped Files Will Be<br></br>Automatically Uploaded
                  </div>
                </div>
              ) : (
                <div className="onDragOut">
                  <div
                    style={{
                      top: "50%",
                      height: "50%",
                      transform: "translateY(63%)",
                      pointerEvents: "none",
                    }}
                  >
                    <label style={{ textAlign: "center" }} for="files">
                    <AiOutlineCloudUpload style={{fontSize: "50px"}}/>
                      <br />
                      <div className={classes.subText}>
                        Click To Browse Or <br></br>Drag And Drop
                      </div>
                    </label>
                    <input
                      type="file"
                      id="files"
                      style={{ display: "none" }}
                      multiple
                    />
                  </div>
                </div>
              )}
            </div>
            <br />
            <br />
            {allFilesConverted == 1 ? (
              <Button
                onClick={handleDownloadAllFiles}
                className={classes.buttonGreen}
              >
                <div
                  style={{
                    transform: "translateY(2px)",
                  }}
                >
                  Download All
                </div>
              </Button>
            ) : (
              <Button onClick={handlePopup} className={classes.button}>
                <div style={{ transform: "translateY(2px)" }}>Convert All</div>
              </Button>
            )}

            <Button onClick={handleNavigate} className={classes.altButton}>
              <div style={{ transform: "translateY(2px)" }}>Settings</div>
            </Button>

            {fileRejected == 1 ? (
              <div className={classes.warningMessage}>
                Please make sure all files are of format(s):{" "}
                {intersperse(settings[0].originFile, ", ")}
              </div>
            ) : fileRejected == 2 ? <div className={classes.warningMessage}>
                No files have been uploaded.
              </div> : (
              <></>
            )}
            <br />
            <div>
              <Typography
                variant="h3"
                style={{
                  fontWeight: "bold",
                  fontSize: "175%",
                  marginTop: "20px",
                  textDecoration: "underline",
                  display: "inline-block",
                  marginRight: "20px",
                  marginBottom: "10px",
                }}
              >
                Uploaded Files
              </Typography>{" "}
              <Typography
                variant="h3"
                className={classes.link}
                style={{
                  fontWeight: "bold",
                  fontSize: "125%",
                  marginTop: "2%",
                  display: "inline-block",
                  transform: "translateY(1px)",
                  marginLeft: "0px",
                  marginBottom: "10px",
                }}
                onClick={handleClearFiles}
              >
                Clear Files
              </Typography>
              {files.map((file) => (
                <UploadedFile
                  file={file}
                  percentages={percentages}
                  fileName={file.name}
                  handleRemoveFile={handleRemoveFile}
                  handleFileDownload={handleFileDownload}
                  handleSingleFileUpload={handleSingleFileUpload}
                  handlePopup={handlePopup}
                  confirmSingleUpdatePopup={confirmSingleUpdatePopup}
                  setConfirmSingleUpdatePopup={setConfirmSingleUpdatePopup}
                />
              ))}
            </div>
          </form>
        )}
      </Dropzone>

      {confirmUpdatePopup == 1 ? <><ConfirmUpdatePopup setConfirmUpdatePopup={setConfirmUpdatePopup} confirmUpdatePopup={confirmUpdatePopup} handleFileUpload={handleFileUpload} handleSingleFileUpload={handleSingleFileUpload} multipleFiles={1}/></> : <></>}
    </Container>
  );
};

export default Body;

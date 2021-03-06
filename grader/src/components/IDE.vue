<template>
  <!-- Two-way Data-Binding -->
  <v-card style="border-radius: 0px;  " class="slide-in-bottom ">
    <v-system-bar color="transparent">
      <v-icon color="green lighten-1">mdi-checkbox-blank-circle</v-icon>

      <v-icon color="yellow">mdi-checkbox-blank-circle</v-icon>

      <v-icon color="red">mdi-checkbox-blank-circle</v-icon>
    </v-system-bar>
    <v-row>
      <!-- title -->
      <v-col cols="4" align="start">
        <v-btn text style="font-weight:bold;" class="title">{{
          ide.title
        }}</v-btn>
      </v-col>
      <!-- font Size -->
      <v-col align="end">
        <v-row class="  pa-0" align="center" justify="end">
          <v-col cols="3">
            <v-text-field
              class="textfield-noarrow"
              v-model="ide.fonts"
              type="number"
              label="Font Size"
              hide-details
              outlined
              min="12"
              max="30"
            >
              <template v-slot:append>
                <v-hover>
                  <template v-slot:default="{ hover }">
                    <v-icon
                      :class="hover ? 'elevation-3' : ''"
                      @click="fontDec()"
                      >mdi-minus</v-icon
                    >
                  </template>
                </v-hover>
                <v-hover>
                  <template v-slot:default="{ hover }">
                    <v-icon
                      :class="hover ? 'elevation-3' : ''"
                      @click="fontIns()"
                      >mdi-plus</v-icon
                    >
                  </template>
                </v-hover>
              </template>
            </v-text-field>
          </v-col>
          <!-- Language display -->
          <v-col cols="3">
            <v-text-field
              label="Language"
              class=" "
              hide-details
              v-model="ide.language"
              outlined
              readonly
            >
              <template v-slot:append>
                <v-icon>mdi-alphabetical-variant</v-icon>
              </template>
            </v-text-field>
          </v-col>
          <!-- Theme select -->
          <v-col cols="4">
            <v-select
              hide-details
              :items="ide.editorThemes"
              :menu-props="{ bottom: true, offsetY: true }"
              class=" "
              v-model="cmOptions.theme"
              outlined
              label="Editor Theme"
            >
              <template v-slot:prepend-inner>
                <v-icon>mdi-theme-light-dark</v-icon>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- space -->
    <!-- code editor -->
    <codemirror v-model="ide.code" :style="ideStyle" :options="cmOptions" />
    <!-- action button -->
    <v-row v-if="footer" full-width justify="space-between" align="center">
      <v-col>
        <v-row class=" " justify="start">
          <!-- Upload local Code -->
          <v-btn @click="$refs.inputUpload.click()" color="info" raised>
            <v-icon left>mdi-upload</v-icon> Upload Code
          </v-btn>
          <input
            v-show="false"
            ref="inputUpload"
            type="file"
            accept=".c , .cpp"
            @change="codeUpload"
          />
          <!-- Error alert -->
          <v-dialog v-model="uploadError" persistent width="500">
            <div class="pa-5" color="transparent">
              <v-alert
                class="mb-0"
                prominent
                dense
                :class="shake"
                v-model="uploadError"
                dismissible
                color="indigo"
                border="left"
                elevation="2"
                colored-border
                icon="mdi-close-circle-outline"
              >
                Oops. We encounter :
                <span style="color:red;">{{ uploadError_Message }} </span>
              </v-alert>
            </div>
          </v-dialog>
        </v-row>
      </v-col>

      <v-col>
        <v-row class=" " justify="end">
          <!-- Complie sample -->
          <v-btn color="warning" class="mr-5" raised @click.end="openCompile()">
            <v-icon left>mdi-console</v-icon> Open Console
          </v-btn>
          <!-- Submit code -->
          <v-btn
            :loading="submitWait"
            color="success"
            @click.end="Submit()"
            raised
          >
            <v-icon left>mdi-cloud-upload</v-icon> Submit
          </v-btn>
          <!-- submit warning -->
          <v-dialog width="500" persistent v-model="snackbar">
            <v-card dark>
              <v-card-title>
                <span v-if="submitWait">
                  <v-progress-circular
                    :value="20"
                    indeterminate
                  ></v-progress-circular>
                </span>
                <div v-else>
                  <span>
                    <v-icon class="mx-auto pa-0" :color="snackbarIconColor">{{
                      snackbarIcon
                    }}</v-icon>
                    {{ text }}
                  </span>
                  <br>
                  <span>Result : </span>
                  <span v-if="result == ''">
                    <v-progress-circular
                      :value="20"
                      indeterminate
                    ></v-progress-circular>
                  </span>
                  <span v-else>
                    {{ result }}
                  </span>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="!submitWait"
                  color="pink"
                  text
                  @click="closeSnackbar"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-col>
    </v-row>
    <!-- <v-divider></v-divider> -->
    <!-- Console -->
    <v-sheet
      dark
      id="logs"
      class="glow-lg-indigo console-textarea text-left mt-2 elevation-3 rounded-xl"
      v-show="compile.show"
    >
      <!-- Result -->
      <v-card class="pa-5 rounded-xl">
        <v-toolbar class="elevation-0">
          <v-col cols="2">
            <v-btn block :ripple="false" style="font-size:1.25rem" class="mt-1" id="result" color="info"
              ><strong>Result</strong></v-btn
            >
          </v-col>
          <v-col cols="3">
            <v-btn
              :ripple="false"
              v-if="compile.time"
              block
              outlined
              class="mt-1"
              id="result"
              color="info"
              >Time Used : <strong>{{ compile.time + " s." }}</strong></v-btn
            >
          </v-col>
          <v-col class="  pa-0" align="end">
            <v-row class="  pa-0" align="center" justify="end">
              <v-col>
                <v-btn outlined color="warning">
                  <v-checkbox
                    label="Compile With Sample"
                    color="orange darken-1"
                    class=" "
                    hide-details
                    v-model="compile.withSample"
                  ></v-checkbox>
                </v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn
                  block
                  id="result"
                  :loading="compile.wait"
                  color="indigo"
                  dark
                  @click.end="Compiling()"
                >
                  <v-icon left>mdi-code-tags-check</v-icon>
                  <strong>Compile !!</strong>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-toolbar>

        <span v-if="compile.withSample">
          <v-tabs
            class="pa-5  "
            show-arrows
            v-model="compile.tabSelect"
            slider-color="transparent"
          >
            <template v-if="compile.withSample">
              <v-tab
                :ripple="false"
                v-for="(i, index) in compile.compile_Status"
                :key="index"
              >
                <v-chip dark class="pa-4" :ripple="false">
                  <span v-if="!standAloneCase(i)">
                    Case {{ index + 1 }} :
                    <v-icon v-if="i == 'P'" color="success" right
                      >mdi-check-bold</v-icon
                    >
                    <v-icon v-else color="error" right>mdi-close</v-icon>
                  </span>
                  <span v-else> ❌ Compiles Error Code : {{ i }} ❌ </span>
                </v-chip>
              </v-tab>
            </template>
            <!-- <v-tabs-items v-model="compile.tabSelect">
                            <v-tab-item v-for="(i,index) in compile.compile_Status.length" :key="index">
                                <v-textarea class="mt-2 elevation-2" label="Error Logs" readonly style="color:green;" color="success" outlined hide-details v-model="compile.errorText[index]">
                                </v-textarea>
                            </v-tab-item>
                        </v-tabs-items> -->
          </v-tabs>
        </span>
        <!-- without sample -->
        <span v-else>
          <v-textarea
            placeholder="Your input here like : 1 2 3 "
            class="mt-5 elevation-2"
            clearable
            style="color:green;"
            rows="4"
            color="success"
            outlined
            hide-details
            v-model="compile.input"
          >
          <template v-slot:label>
             <span style="font-size:1.5rem;">Input Field</span>
          </template>
          </v-textarea>
          <v-divider class="ma-5" color="transparent"></v-divider>
          <v-textarea
            ref="compileLog"
            id="compileLog"
            v-if="compile.log"
            class="mt-2 elevation-2"
            readonly
            style="color:green;"
            color="success"
            outlined
            hide-details
            v-model="compile.log"
          >
          <template v-slot:label>
             <span style="font-size:1.5rem;">Compile Result</span>
          </template>
          </v-textarea>
        </span>
      </v-card>
    </v-sheet>
    <v-overlay :value="ide.wait">
      <v-progress-circular
        indeterminate
        color="white"
        size="64"
      ></v-progress-circular>
      <span class="mx-5">Retrieving Code</span>
    </v-overlay>
  </v-card>
</template>

<script>
// import language js
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/clike/clike.js";

// import theme style
import "codemirror/theme/base16-dark.css";
import "codemirror/theme/base16-light.css";
import "codemirror/theme/elegant.css";
import "codemirror/theme/ayu-dark.css";
import "codemirror/theme/duotone-light.css";
import "codemirror/theme/blackboard.css";
import "codemirror/theme/eclipse.css";


export default {
  props: {
    footer: Boolean,
    code: String,
    title: String,
    task: null,
  },
  components: {},
  data() {
    return {
      cmOptions: {
        tabSize: 4,
        mode: "text/x-c++src",
        theme: "base16-light",
        lineNumbers: true,
        line: true,
        indentUnit: 0,
        readOnly: this.footer ? false : true,
        smartIndent: true,
        // more CodeMirror options...
      },
      ide: {
        title: "",
        fonts: 16,
        language: "C/C++",
        wait: true,
        editorThemes: [
          "base16-dark",
          "base16-light",
          "elegant",
          "ayu-dark",
          "duotone-light",
          "blackboard",
          "eclipse",
        ],
        dCode:
          '#include<stdio.h> \r\n\nint main() { \r\n    printf("Hello!! CE-BoostUp 8");\r\n    return 0;\n}',
        code: " ",
      },
      //  snackbar //
      snackbar: false,
      submitWait: false,
      text: "Submit Success",
      result: "",
      snackbarIcon: "",
      snackbarIconColor: "",
      ///////////////
      // read file //
      uploadError: null,
      uploadError_Message: "",
      ///////////////
      // compile //
      compile: {
        withSample: false,
        show: false,
        // no sample
        input: "",
        log: "",
        time: "",
        // with sample
        compile_Status: [],
        tabSelect: 0,
        wait: false,
      }, // length depend on question's sample
    };
  },
  computed: {
    shake() {
      return this.uploadError ? "shake-horizontal" : " ";
    },
    Compile() {
      var arr = [];
      for (var i = 0; i < this.compile.compile_Status.length; i++) {
        arr.push(this.compile.compile_Status[i] ? false : true);
      }
      return arr;
    },
    ideStyle() {
      return {
        "font-size": this.ide.fonts + "px",
      };
    },
    qId() {
      return this.task.id;
    },
    numOfSubmissions () {
      return this.$store.state.user.data.submission.length;
    },
  },
  watch: {
    code(_new) {
      this.ide.wait = true;
      this.cmOptions.theme = this.ide.editorThemes[1];
      setTimeout(() => {
        this.ide.wait = false;
        this.cmOptions.theme = this.ide.editorThemes[0];
      }, 500);
      if (_new) this.ide.code = _new;
    },
    title(_new) {
      this.ide.title = _new;
    },
    numOfSubmissions(_new) {
      if (_new == 0 || !this.task) return;
      let last = this.$store.state.user.data.submission[_new - 1];
      if (last.questionId != this.task.id) return;
      this.result = last.result;

      this.$store.dispatch("user/setFetchInterval", {item: "Submissions", val: 0});
    }
  },
  methods: {
    saveSession() {
      var data = {
        id: this.task.id,
        code: this.ide.code,
      };
      sessionStorage.setItem(data.id, data.code);
      // this.$store.commit('user/clearSession');
    },
    codeUpload(e) {
      // define what is needed
      const errorCase = [
        "Invalid file type.",
        "Could not read file.",
        "Could not reach file !?",
        "Unknown Error",
      ];
      const allow_type = ["c", "cpp"];

      // get and read file
      this.uploadError = false;
      const files = e.target.files;
      if (files) {
        const file = files[0];
        if (file) {
          const files_ = file.name.split(".");
          const files_type = files_[files_.length - 1];
          if (allow_type.includes(files_type)) {
            var tmp = this.ide.code;
            this.readTextFile(file);
            var response = this.ide.code;
            if (response) {
              this.ide.code = response;
            } else {
              this.ide.code = tmp;
              this.uploadError = true;
              this.uploadError_Message = errorCase[1];
            }
          } else {
            this.uploadError = true;
            this.uploadError_Message = errorCase[0];
          }
        }
      } else {
        this.uploadError = true;
        this.uploadError_Message = errorCase[2];
      }
    },
    readTextFile(file) {
      var reader = new FileReader();
      reader.onload = () => {
        var contents = reader.result;
        this.ide.code = contents;
      };
      reader.readAsText(file);
    },
    delay(i) {
      setTimeout(() => {
        this.compile.compile_Status[i].state = true;
      }, this.getRandomInt(5000));
    },
    openCompile() {
      this.compile.show = !this.compile.show;
      setTimeout(() => {
        var logs = document.getElementById("logs");
        logs.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);
      this.compile.compile_Status = [];
      this.compile.log = "";
    },
    Compiling() {
      this.compile.wait = true;
      // no sample
      let data = {};
      this.compile.log = "Waiting for response...";

      if (this.compile.withSample) {
        // input
        data.questionId = this.task.id;
        data.sourceCode = this.ide.code;
      } else {
        // without sample
        if (!this.compile.input) this.compile.input = " ";
        data = {
          input: this.compile.input,
          sourceCode: this.ide.code,
        };
      }
      data = JSON.stringify(data);

      this.axios
        .post(this.$store.state.compiler + "/compiler", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          this.compile.wait = false;
          if (this.compile.withSample) {
            this.compile.compile_Status = [];
            for (var i = 0; i < res.data.result.length; i++) {
              this.compile.compile_Status.push(res.data.result.charAt(i));
            }
            this.compile.time = res.data.timeUsage;
          } else {
            if (this.errorCase(res.data.result))
              this.compile.log =
                "❌ Compile error Code : " + res.data.result + " ❌";
            else this.compile.log = res.data.result;
            if (!this.compile.log)
              this.compile.log =
                '😅 Look like the output is empty. Did u forgot "printf()" ?🤨?';
            this.compile.time = res.data.timeUsage;
          }
        })
        .catch(() => {
          this.compile.wait = false;
          this.compile.log =
            '⚠️ Look like server error. Please try again. ⚠️';
          this.compile.time = 0;
        });

      let logs = document.getElementById("compileLog");
      if (logs)
        logs.scrollIntoView({
          behavior: "smooth",
        });
      setTimeout(() => {
        if (this.$refs.compileLog) this.$refs.compileLog.focus();
      }, 500);
    },
    Submit() {
      this.result = "";
      this.snackbar = true;
      this.submitWait = true;
      let data = {
        token: this.$store.getters["user/getToken"],
        code: this.ide.code,
        questionId: this.task.id,
      };
      this.axios
        .post(this.$store.state.api + "/api/v1/submission/", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          this.text = "Submiting was Done Successfully";
          this.snackbarIcon = "mdi-check-bold";
          this.snackbarIconColor = "success";
          this.submitWait = false;
          this.$store.dispatch("user/setFetchInterval", {item: "Submissions", val: 2000, force: false});
        })
        .catch(() => {
          this.submitWait = false;
          this.snackbarIcon = "mdi-close";
          this.snackbarIconColor = "error";
          this.text = "Submiting Come in Failure";
        });
    },
    fontIns() {
      this.ide.fonts += this.ide.fonts < 30 ? 1 : 0;
    },
    fontDec() {
      this.ide.fonts -= this.ide.fonts > 10 ? 1 : 0;
    },
    standAloneCase(item) {
      var standAlone = ["C", "B", "b", "L", "F", "O"];
      return standAlone.includes(item);
    },
    errorCase(item) {
      var error = ["C", "B", "b", "L", "F", "M", "T", "R", "X", "O"];
      return error.includes(item);
    },
    closeSnackbar() {
      this.snackbar = false;
      this.$store.dispatch("user/setFetchInterval", {item: "Submissions", val: 0});
    }
  },
  mounted() {
    if (this.code) {
      this.ide.code = this.code;
      this.ide.wait = false;
    } else {
      setTimeout(() => {
        this.ide.wait = false;
        var ss = sessionStorage.getItem(this.qId);
        if (ss) this.ide.code = ss;
        else this.ide.code = this.ide.dCode;
      }, 1000);
      window.onbeforeunload = () => {
        this.saveSession();
        return true;
      };
    }
    if (!this.title) {
      this.ide.title = "Write Your Code Below..";
    } else this.ide.title = this.title;
  },
  created() {
    this.ide.wait = true;
    setTimeout(() => {
      this.ide.wait = false;
      this.cmOptions.theme = this.ide.editorThemes[0];
    }, 500);
  },
  beforeDestroy() {
    this.$store.dispatch("user/setFetchInterval", {item: "Submissions", val: 0});
  },
};
</script>

<style lang="scss" scoped>
@import "../css/animation.css";</style
><style>
.console-textarea {
  font-family: monospace, monospace, "Kanit", sans-serif !important;
}

.CodeMirror {
  min-height: 500px;
  min-width: 500px;
}

.CodeMirror-scroll {
  text-align: left !important;
}

.CodeMirror-gutter-filler,
.CodeMirror-hscrollbar,
.CodeMirror-scrollbar-filler,
.CodeMirror-vscrollbar {
  z-index: 2 !important;
}

.textfield-noarrow input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.textfield-noarrow input[type="number"] {
  -moz-appearance: textfield;
}
</style>

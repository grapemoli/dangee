<!-- JavaScript -->
<script setup>
import {computed, ref} from "vue";
import {useStore} from 'vuex';
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";
import {usePrimeVue} from 'primevue/config';
import {useRouter} from "vue-router";

const router = useRouter();
const store = useStore();
const contract = store.getters['contract'];
const toast = useToast();
const confirm = useConfirm();

const minter = computed(() => store.getters['minter']);
const isAuth = computed(() => store.getters['isAuth']);
const disabled = ref(true);

// For progress bar.
const loadingStyle = ref('display: none;');
const overlayStyle = ref('display: none;');

// For form inputs.
const price = ref(null);
const active = ref(0);
const name = ref();
const fastGasCost = ref(0);
const slowGasCost = ref(0);

// For file upload.
const $primevue = usePrimeVue();

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const onClearTemplatingUpload = (clear) => {
  clear();
  totalSize.value = 0;
  totalSizePercent.value = 0;
};

const onSelectedFiles = (event) => {
  files.value = event.files;
  files.value.forEach((file) => {
    totalSize.value += parseInt(formatSize(file.size));
  });
};

const onTemplatedUpload = () => {
  toast.add({ severity: "info", summary: "Success", detail: "NFT Minted", life: 3000 });
};

const formatSize = (bytes) => {
  const k = 1024;
  const dm = 3;
  const sizes = $primevue.config.locale.fileSizeTypes;

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};

async function estimateGas() {
  // We use a 'throwaway' IPFS hash: the first IPFS hash.
  const IPFSHash = 'QmSVPkvNkyMVTXAGmjJxSg9mJdsWLXMGWXpSeMGP9r9ejC';

  const gas = await contract.methods.safeMintWithPrice(store.getters['userId'], IPFSHash, price.value, true).estimateGas(
      {
        from: store.getters['userId']
      });

  await store.dispatch('updateGasFee');
  await store.dispatch('updateBalance');

  // Gas Cost = (Gas + GasPriceGWei * Wei/GWei)
  // The user is informed of the gas price in MATIC, which is equivalent to 0.000000001 GWei.
  const lowCost = (gas * store.getters['gasFee'].FastGasPrice * 0.000000001);
  const fastCost = (gas * store.getters['gasFee'].suggestBaseFee * 0.000000001);

  // Toaster to inform the user that they may not have enough to mint an NFT, but don't stop them.
  if (store.getters['balance'] < lowCost) {
    toast.add({ severity: "info", summary: "Not Enough MATIC", detail: "Based on estimates, you may not have enough MATIC. If you proceed with minting this ITM, you may lose MATIC.", life: 3000 });
  }

  fastGasCost.value = lowCost;
  slowGasCost.value = fastCost;
}

async function mint() {
  // Pin the image to IPFS using Piñata API, and get the IPFS hash. Then, mint the NFT.
  // Note: In this approach, the API key is exposed. In development, take measures to hide the
  // API key or keep it safe, e.g., Azure's Key Vaults.
  toast.add({ severity: "info", summary: "Minting", detail: `Please stay on this page while your ITM is minting!`, life: 3000 });

  loadingStyle.value = 'display: block';
  overlayStyle.value = 'display: block';

  var IPFSHash = '';
  try {

    // Use Form Data to send the image (as a Blob) to Piñata API.
    // 1. Make the blob.
    const file = files.value[0].objectURL;
    const fileRes = await fetch(file);
    const blob = await fileRes.blob();

    // 2. Make the form data.
    let formData = new FormData();

    formData.append('file', blob);

    const pinataMetadata = JSON.stringify({
      name: files.value[0].name,
    });
    formData.append("pinataMetadata", pinataMetadata)

    // 3. Send request to pin image Piñata API. Get IPFS Hash response.
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
      body: formData,
    });

    const resData = await res.json();
    IPFSHash = resData.IpfsHash;

    // Call the smart contract to mint the NFT.
    // safeMintWithPrice parameters: (address to, string memory uri, uint256 price, bool onMarket)
    // Note: We are converting the price from MATIC to Wei, then wrapping it as a string because javascript does not
    // support 256-bit integers.
    const priceWei = `${price.value * 1000000000000000000}`;
    contract.methods.safeMintWithPrice(store.getters['userId'], IPFSHash, priceWei, true)
        .send ({from: store.getters['userId']})
        .then(() => {

          // Toast-inform the user that the minting was successful.
          // We don't do it here because the TopBanner already listens for the emitted NewItem event.
          loadingStyle.value = 'display: none';
          overlayStyle.value = 'display: none';
        })
        .catch(async (err) => {

          loadingStyle.value = 'display: none';
          overlayStyle.value = 'display: none';

          // Unpin the image
          const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${IPFSHash}`,
              {
                method: "DELETE",
                headers: {
                  accept: "application/json",
                  Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
                },
              })

          // Toast-inform the user that the minting was *not* successful.
          if (err.code === 4001) {
            toast.add({ severity: "error", summary: "Minting Error", detail: `User denied transaction signature.`, life: 3000 });
          }
          else {
            toast.add({ severity: "error", summary: "Minting Error", detail: `${err}`, life: 3000 });
          }
        });
  }
  catch (err) {

    loadingStyle.value = 'display: none';
    overlayStyle.value = 'display: none';

    // Unpin the image.
    const response = await fetch(
        `https://api.pinata.cloud/pinning/unpin/${IPFSHash}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
        })

    toast.add({ severity: "error", summary: "Error", detail: `${err}`, life: 3000 });
  }
}
</script>


<!-- HTML -->
<template>
  <h1 class="title">Mint an ITM</h1>
  <Toast></Toast>

  <!-- Only show the minter form if the user has the Minter role. -->
  <div v-if="!minter" style="padding: 10%;" class="form">

    <!-- Case 1: User is logged in with no minter status. -->
    <div v-if="isAuth">
      <p>Request for the Minter status to begin minting!</p>
    </div>

    <!-- Case 2: User is not logged in. -->
    <div v-else>
      <p>Login to begin minting!</p>
    </div>
  </div>


  <div v-else class="form">
    <!-- Form to mint an NFT. -->
    <div class="card flex justify-content-center" style="padding-top:0; margin-top:0;">
      <Stepper linear v-model:activeStep="active">

        <!-- Step #1: Upload Image -->
        <StepperPanel>
          <template #header="{ index, clickCallback }">
            <button class="bg-transparent border-none inline-flex flex-column gap-2" @click="clickCallback">
                      <span :class="['border-round border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                          <i class="pi pi-image" />
                      </span>
            </button>
          </template>
          <template #content="{ nextCallback }">
            <div class="flex flex-column gap-2 mx-auto">
              <div class="text-center mt-3 mb-3 text-xl font-semibold">Upload an Image</div>

              <!-- File Upload Card. -->
              <div class="card" style="padding-top:0;">

                <!-- Upload file button -->
                <FileUpload name="nftImg"  @upload="onTemplatedUpload($event)" :multiple="false" :fileLimit='1' accept="image/*" :maxFileSize="26843545600" @select="onSelectedFiles">
                  <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                    <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                      <div class="flex gap-2">
                        <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined :disabled="files.length >= 1"></Button>
                      </div>
                    </div>
                  </template>

                  <!-- Drag and drop template -->
                  <template #empty>
                    <div v-if='files.length === 0' class="flex align-items-center justify-content-center flex-column">
                      <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
                      <p class="mt-4 mb-0" style="padding-bottom:10%;">Drag and drop an image here to upload.</p>
                    </div>

                    <div v-else>
                      <!-- Call back gets rid of the uploaded file, so this is shows the uploaded file when the user
                      goes backwards in the form. -->
                      <div class="p-fileupload-file" data-pc-section="file"><img role="presentation" class="p-fileupload-file-thumbnail" alt="09ecda0a-2ef5-4c00-966e-cb35d9a9db1c.jpg" :src="files[0].objectURL" width="50" data-pc-section="thumbnail"><div class="p-fileupload-file-details" data-pc-section="details"><div class="p-fileupload-file-name" data-pc-section="filename">{{files[0].name}}</div><span class="p-fileupload-file-size" data-pc-section="filesize">3.487 MB</span><span class="p-badge p-component p-badge-warning p-fileupload-file-badge" data-pc-name="badge" data-pc-extend="badge" data-pc-section="root">Pending</span></div><div class="p-fileupload-file-actions" data-pc-section="actions"></div></div>
                    </div>
                  </template>
                </FileUpload>

              </div>

            </div>
            <div class="flex pt-4 justify-content-end">
              <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" :disabled="files.length === 0"/>
            </div>
          </template>
        </StepperPanel>

        <!-- Step #2: Information Input -->
        <StepperPanel>
          <template #header="{ index, clickCallback }">
            <button class="bg-transparent border-none inline-flex flex-column gap-2" @click="clickCallback">
                      <span :class="['border-round border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                          <i class="pi pi-pencil" />
                      </span>
            </button>
          </template>
          <template #content="{ prevCallback, nextCallback }">
            <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
              <div class="text-center mt-3 mb-3 text-xl font-semibold">Configure ITM Data</div>

              <div class="card flex justify-content-center field p-fluid">

                <!-- Price input. Minimum is 1 Wei (10^-18 MATIC), with no upper maximum. -->
                <FloatLabel>
                  <label for="price"> Price (MATIC) </label>
                  <InputNumber v-model="price" inputId="price" :min="0.000000000000000001" :minFractionDigits="0" :maxFractionDigits="18" />
                </FloatLabel>
              </div>

            </div>
            <div class="flex pt-4 justify-content-between">
              <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
              <Button label="Next" icon="pi pi-arrow-right" iconPos="right" :disabled="!!!price" @click="nextCallback" />
            </div>
          </template>
        </StepperPanel>

        <!-- Review Information, with gas estimates -->
        <StepperPanel>
          <template #header="{ index, clickCallback }">
            <button class="bg-transparent border-none inline-flex flex-column gap-2" @click="clickCallback">
                      <span :class="['border-round border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                          <i class="pi pi-id-card" />
                      </span>
            </button>
          </template>
          <template #content="{ prevCallback }">
            <div class="flex flex-column gap-2 mx-auto">
              <div class="text-center mt-3 mb-3 text-xl font-semibold">Review Information</div>

              <table style="width:100%; padding:0%; margin:0%;">
                <colgroup>
                  <col span="1" style="width: 75%;">
                  <col span="1" style="width: 25%;">
                </colgroup>

                <tbody>
                <tr style="text-align:left;">
                  <Image imageClass="block xl:block mx-auto border-round w-full" style='height:100%;' :id="files[0].name" :src="files[0].objectURL" alt="The image you uploaded" preview></Image>
                </tr>
                <tr>
                  <th style="padding-top:3%;">
                    <p>Minter</p>
                  </th>
                  <th style="padding-top:3%; overflow-x:scroll;">
                    <p style="font-weight:normal;">{{store.getters['userId']}}</p>
                  </th>
                </tr>

                <tr>
                  <th>
                    <p>Price (MATIC)</p>
                  </th>
                  <th>
                    <p style="font-weight:normal; overflow-x:scroll;">{{price}}</p>
                  </th>
                </tr>

                </tbody>
              </table>
            </div>

            <div class="flex pt-4 justify-content-between">
              <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
              <Button label="Mint ITM" icon="pi pi-check" iconPos="right"  @click="mint()" />
            </div>
          </template>
        </StepperPanel>
      </Stepper>
    </div>
  </div>

  <!-- Progress Spinner. -->
  <div class="overlay" :style="overlayStyle"></div>

  <!-- Loading for if the user is minting an NFT -->
  <div class="card flex justify-content-center">
    <ProgressSpinner class="progress-spinner" :style="loadingStyle"/>
  </div>

</template>


<!-- CSS -->
<style scoped>
.title {
  text-align: center;
  margin-top: 4%;
  margin-bottom: 0;
  padding-bottom: 0;
  font-family: "Bebas Neue", sans-serif;
  font-size: 10vh;
  font-weight: 400;
  font-style: normal;
}

.p-stepper {
  flex-basis: 40rem;
}

.progress-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 4000;

  transform: translate(-50%, -50%);
}

.form {
  position: relative;
}

.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 2;
}
</style>
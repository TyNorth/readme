<template>
  <q-page padding>
    <div class="q-mb-lg">
      <div class="text-h4 text-gold">Account Requests Management</div>
      <div class="text-caption text-grey-5 q-mt-xs">Review and process new account requests.</div>
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row items-center q-gutter-md">
          <div class="text-subtitle1">Filter by Status:</div>
          <q-select
            v-model="filterStatus"
            :options="statusOptions"
            label="Status"
            filled
            dense
            emit-value
            map-options
            style="min-width: 200px"
            :dark="$q.dark.isActive"
            @update:model-value="fetchRequests"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-table
      :rows="requests"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      bordered
      :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'"
      :pagination="initialPagination"
    >
      <template v-slot:body-cell-requested_at="props">
        <q-td :props="props">
          {{ formatDate(props.value) }}
        </q-td>
      </template>

      <template v-slot:body-cell-reason="props">
        <q-td
          :props="props"
          style="white-space: pre-wrap; max-width: 300px; overflow-wrap: break-word"
        >
          {{ props.value || '-' }}
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <q-btn
            v-if="props.row.status === 'pending'"
            color="positive"
            icon="sym_o_check_circle"
            size="sm"
            dense
            @click="approveRequest(props.row)"
            label="Approve"
            :loading="actionLoading[props.row.id] === 'approving'"
          />
          <q-btn
            v-if="props.row.status === 'pending'"
            color="negative"
            icon="sym_o_cancel"
            size="sm"
            dense
            @click="openRejectDialog(props.row)"
            label="Reject"
            :loading="actionLoading[props.row.id] === 'rejecting'"
          />
          <q-chip
            v-if="props.row.status === 'approved'"
            color="positive"
            text-color="white"
            icon="sym_o_person_add"
            label="Approved"
            size="sm"
          />
          <q-chip
            v-if="props.row.status === 'rejected'"
            color="negative"
            text-color="white"
            icon="sym_o_gpp_bad"
            label="Rejected"
            size="sm"
          />
        </q-td>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center text-primary q-gutter-sm q-pa-lg">
          <q-icon size="2em" name="sym_o_sentiment_dissatisfied" />
          <span> No account requests found for the selected status. </span>
        </div>
      </template>
    </q-table>

    <q-dialog v-model="rejectDialogVisible">
      <q-card style="min-width: 350px" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-white'">
        <q-card-section class="row items-center">
          <div class="text-h6">Reject Account Request</div>
          <q-space />
          <q-btn icon="sym_o_close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>
            Are you sure you want to reject the request for
            <strong>{{ currentRequestToProcess?.username }}</strong> ({{
              currentRequestToProcess?.email
            }})?
          </p>
          <q-input
            v-model="rejectionNote"
            label="Reason for Rejection (Optional, for admin notes)"
            type="textarea"
            filled
            autogrow
            :dark="$q.dark.isActive"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            flat
            label="Confirm Reject"
            color="negative"
            @click="confirmRejectRequest"
            :loading="actionLoading[currentRequestToProcess?.id || ''] === 'rejecting_confirm'"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/boot/supabase'
import { Notify, date } from 'quasar' // Import date for formatting

const requests = ref([])
const loading = ref(false)
const actionLoading = ref({}) // For per-row action loading state e.g. { 'uuid': 'approving' }

const filterStatus = ref('pending')
const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

const initialPagination = ref({
  rowsPerPage: 10,
})

const columns = [
  { name: 'username', label: 'Username', field: 'username', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  {
    name: 'reason',
    label: 'Reason for Request',
    field: 'reason',
    align: 'left',
    classes: 'reason-cell',
  },
  {
    name: 'requested_at',
    label: 'Requested At',
    field: 'requested_at',
    align: 'left',
    sortable: true,
    format: (val) => formatDate(val),
  },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true }, // Good to see status even if filtered
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
]

// Dialog state
const rejectDialogVisible = ref(false)
const currentRequestToProcess = ref(null)
const rejectionNote = ref('')

function formatDate(timestamp) {
  return date.formatDate(timestamp, 'YYYY-MM-DD HH:mm')
}

async function fetchRequests() {
  loading.value = true
  requests.value = [] // Clear previous requests
  try {
    const { data, error } = await supabase
      .from('account_requests')
      .select('*')
      .eq('status', filterStatus.value)
      .order('requested_at', { ascending: true })

    if (error) throw error
    requests.value = data || []
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: `Failed to fetch requests: ${err.message}`,
    })
  } finally {
    loading.value = false
  }
}

async function updateRequestStatus(request, newStatus, notes = null) {
  actionLoading.value[request.id] =
    newStatus === 'approved' ? 'approving' : notes ? 'rejecting_confirm' : 'rejecting'
  try {
    const updates = { status: newStatus }
    if (notes !== null) {
      updates.admin_notes = notes
    }

    const { error } = await supabase.from('account_requests').update(updates).eq('id', request.id)

    if (error) throw error

    Notify.create({
      type: 'positive',
      message: `Request for ${request.username} has been ${newStatus}.`,
    })
    // Remove the processed item from the current list or refetch
    requests.value = requests.value.filter((r) => r.id !== request.id)
    // If you want to see it move to a different filter immediately, you might just refetch:
    // await fetchRequests();
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: `Failed to update request: ${err.message}`,
    })
  } finally {
    delete actionLoading.value[request.id]
  }
}

async function approveRequest(request) {
  await updateRequestStatus(request, 'approved')
  // The backend trigger and function will handle user creation.
}

function openRejectDialog(request) {
  currentRequestToProcess.value = request
  rejectionNote.value = '' // Clear previous note
  rejectDialogVisible.value = true
}

async function confirmRejectRequest() {
  if (!currentRequestToProcess.value) return
  await updateRequestStatus(currentRequestToProcess.value, 'rejected', rejectionNote.value)
  rejectDialogVisible.value = false
  currentRequestToProcess.value = null // Reset
}

onMounted(() => {
  fetchRequests() // Fetch pending requests on component mount
})

// Watch for filter changes if you want to keep the select component interactive
// (already handled by @update:model-value on q-select)
// watch(filterStatus, fetchRequests);
</script>

<style scoped>
.text-gold {
  color: #c49a43; /* Your theme's gold color */
}
.reason-cell {
  white-space: pre-wrap; /* Allows line breaks in reason */
  max-width: 300px;
  overflow-wrap: break-word;
}
.q-table th {
  font-weight: bold;
}
</style>

<template>
    <div>
        <Navbar />
        <v-container>
            <LogsTable />
        </v-container>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import LogsTable from '@/components/archive/LogsTable'

export default {
    name: 'ArchivePage',
    components: {
        Navbar,
        LogsTable
    }
}
</script>
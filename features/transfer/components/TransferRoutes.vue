<template>
    <section class="transfer-routes" :aria-labelledby="headingId">
        <AppContainer size="wide" class="transfer-routes__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('transfer.routes-title')"
                :lead="t('transfer.routes-lead')"
            >
                <template #action>
                    <BookButton context-kind="transfer" />
                </template>
            </SectionHeader>

            <TransferRoutesTable v-reveal />
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const headingId = useId();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.transfer-routes {
    background-color: var(--surface);
    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(48);
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(32);
        }
    }
}
</style>

<template>
  <madoka-dialog
    v-model="opened"
    title="用户资料"
    width="380px"
    height="auto"
    :footer="false"
  >
    <div class="profile">
      <div class="profile__banner">
        <div class="profile__avatar">
          <img v-if="user.avatar" :src="user.avatar" alt="" />
          <div v-else class="profile__avatar-fallback">
            {{ user.username?.charAt(0) }}
          </div>
        </div>
      </div>

      <div class="profile__meta">
        <div class="profile__name">
          {{ user.username }}
          <span v-if="user.externalId" class="profile__eid">
            #{{ user.externalId }}
          </span>
        </div>
        <div class="profile__origin" v-if="user.origin && !isLocalUser(user.origin)">
          {{ user.origin }}
        </div>
      </div>

      <div class="profile__stats" v-if="isLocalUser(user.origin)">
        <div class="profile__stat">
          <div class="profile__stat-value">
            {{ profile.messageCount ?? '—' }}
          </div>
          <div class="profile__stat-label">发言</div>
        </div>
        <div class="profile__stat-divider"></div>
        <div class="profile__stat">
          <div class="profile__stat-value">
            {{ profile.lastLogin ?? '—' }}
          </div>
          <div class="profile__stat-label">最近登录</div>
        </div>
      </div>
      <div class="profile__external" v-else>
        来自 {{ user.origin }} 的用户
      </div>

      <div class="profile__section" v-if="profile.previousNames?.length">
        <div class="profile__section-title">曾用名</div>
        <div class="profile__names">
          <span
            v-for="name in profile.previousNames"
            :key="name"
            class="profile__name-tag"
          >
            {{ name }}
          </span>
        </div>
      </div>

      <div class="profile__section" v-if="isLocalUser(user.origin)">
        <div class="profile__section-title">最近发言</div>
        <div class="profile__messages" v-if="profile.messages?.length">
          <div
            v-for="msg in profile.messages"
            :key="msg.id"
            class="profile__msg"
          >
            <div class="profile__msg-content">{{ msg.content }}</div>
            <div class="profile__msg-time">
              {{ dayjs(msg.createTime).format('MM/DD HH:mm') }}
            </div>
          </div>
        </div>
        <div v-else class="profile__empty">暂无发言记录</div>
      </div>
    </div>
  </madoka-dialog>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import UserApi from '@/api/UserApi.ts'
import MadokaDialog from '@/components/MadokaDialog.vue'

type UserData = {
  userId: number
  username: string
  externalId?: number
  origin?: string
  userUpdateTime?: number
  avatar?: string
}

type ProfileData = {
  messageCount?: number
  lastLogin?: string
  previousNames?: string[]
  messages?: { id: number; content: string; createTime: number }[]
}

const opened = ref(false)

const user = reactive<UserData>({
  userId: 0,
  username: '',
})

const profile = reactive<ProfileData>({
  messageCount: undefined,
  lastLogin: undefined,
  previousNames: undefined,
  messages: undefined,
})

const loadProfile = async (userId: number) => {
  try {
    const res = (await UserApi.getProfile(userId)) as any
    profile.messageCount = res.messageCount
    profile.lastLogin = res.lastLoginTime
      ? dayjs(res.lastLoginTime * 1000).format('YY/MM/DD HH:mm')
      : undefined
    profile.previousNames = res.oldUsername
      ? res.oldUsername.split(',').filter(Boolean)
      : undefined
  } catch (e) {
    console.error('Failed to load user profile', e)
  }
}

const loadMessages = async (userId: number) => {
  try {
    const res = (await UserApi.getMessages(userId)) as any
    profile.messages = res.list
  } catch (e) {
    console.error('Failed to load user messages', e)
  }
}

const isLocalUser = (origin?: string) => origin === 'madokami'

const open = async (userData: UserData) => {
  Object.assign(user, userData)
  profile.messageCount = undefined
  profile.lastLogin = undefined
  profile.previousNames = undefined
  profile.messages = undefined
  opened.value = true

  if (!isLocalUser(userData.origin)) return

  loadProfile(userData.userId)
  loadMessages(userData.userId)
}

defineExpose({ open })
</script>

<style scoped lang="less">
@pink: #ff8fab;
@pink-light: rgba(255, 200, 220, 0.35);
@pink-deep: #d64570;
@text-main: #3d2b40;
@text-sub: #8a6b80;
@text-muted: rgba(138, 107, 128, 0.55);

.profile {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 8px 0 16px;
  color: @text-main;

  // ─── 顶部 banner + 头像 ───
  &__banner {
    position: relative;
    height: 72px;
    margin: -4px -20px 0;
    background: linear-gradient(135deg, #ffd6e080, #ffc2d680, #e8b4f880);
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  &__avatar {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    border: 3px solid rgba(255, 255, 255, 0.85);
    box-shadow: 0 4px 16px rgba(214, 69, 112, 0.2);
    transform: translateY(34px);
    z-index: 1;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__avatar-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ffd6e0, #f0a6c4);
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  }

  // ─── 用户名区域 ───
  &__meta {
    text-align: center;
    margin-top: 42px;
    margin-bottom: 4px;
  }

  &__name {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.3px;
  }

  &__eid {
    font-size: 13px;
    font-weight: 400;
    color: @text-muted;
    margin-left: 2px;
  }

  &__origin {
    font-size: 12px;
    color: @text-muted;
    margin-top: 2px;
  }

  // ─── 统计区 ───
  &__stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin: 12px 0 4px;
    padding: 12px 20px;
    background: linear-gradient(135deg, rgba(255, 214, 224, 0.25), rgba(240, 198, 220, 0.2));
    border-radius: 14px;
    border: 1px solid rgba(255, 183, 197, 0.15);
  }

  &__stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
  }

  &__stat-value {
    font-size: 17px;
    font-weight: 700;
    color: @pink-deep;
    letter-spacing: -0.3px;
  }

  &__stat-label {
    font-size: 11px;
    color: @text-sub;
    letter-spacing: 0.5px;
  }

  &__stat-divider {
    width: 1px;
    height: 28px;
    background: rgba(255, 143, 171, 0.2);
    flex-shrink: 0;
  }

  &__external {
    font-size: 13px;
    color: @text-sub;
    text-align: center;
    margin: 12px 0 4px;
    padding: 10px 16px;
    background: rgba(255, 214, 224, 0.15);
    border-radius: 12px;
    border: 1px dashed rgba(255, 143, 171, 0.2);
  }

  // ─── 通用 section ───
  &__section {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__section-title {
    font-size: 12px;
    font-weight: 600;
    color: @pink;
    letter-spacing: 1px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;

    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, rgba(255, 143, 171, 0.3), transparent);
    }
  }

  // ─── 曾用名 ───
  &__names {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__name-tag {
    font-size: 12px;
    padding: 4px 12px;
    background: @pink-light;
    border-radius: 20px;
    color: #7a4f60;
    border: 1px solid rgba(255, 183, 197, 0.15);
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 200, 220, 0.5);
    }
  }

  // ─── 发言列表 ───
  &__messages {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 190px;
    overflow-y: auto;
    padding-right: 4px;

    &::-webkit-scrollbar {
      width: 3px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 143, 171, 0.25);
      border-radius: 3px;
    }
  }

  &__msg {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.45);
    border-radius: 10px;
    border: 1px solid rgba(255, 214, 224, 0.2);
    font-size: 13px;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.65);
    }
  }

  &__msg-content {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.5;
    color: @text-main;
  }

  &__msg-time {
    flex-shrink: 0;
    font-size: 11px;
    color: @text-muted;
    line-height: 1.5;
    white-space: nowrap;
  }

  &__empty {
    font-size: 13px;
    color: @text-muted;
    text-align: center;
    padding: 20px 0;
  }
}
</style>

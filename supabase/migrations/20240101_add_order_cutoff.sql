-- Migration: Add weekly order cutoff settings to site_settings
-- Run this in Supabase SQL Editor after the main schema is applied

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS cutoff_day   SMALLINT NOT NULL DEFAULT 4,  -- 0=Sun, 1=Mon ... 4=Thu, 6=Sat
  ADD COLUMN IF NOT EXISTS cutoff_time  TIME     NOT NULL DEFAULT '23:59:00',
  ADD COLUMN IF NOT EXISTS reopen_day   SMALLINT NOT NULL DEFAULT 1,  -- 1=Mon
  ADD COLUMN IF NOT EXISTS reopen_time  TIME     NOT NULL DEFAULT '06:00:00',
  ADD COLUMN IF NOT EXISTS auto_cutoff_enabled BOOLEAN NOT NULL DEFAULT true;

-- Update the existing default row with sensible values
UPDATE public.site_settings
SET
  cutoff_day = 4,
  cutoff_time = '23:59:00',
  reopen_day = 1,
  reopen_time = '06:00:00',
  auto_cutoff_enabled = true,
  business_name = 'SauPreps'
WHERE id = 1;

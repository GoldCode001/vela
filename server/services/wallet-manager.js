import { supabase } from '../config/supabase.js';
import { ethers } from 'ethers';

// Create or retrieve Polygon wallet for a user
export async function getOrCreatePolygonWallet(baseWalletAddress) {
  try {
    // First, check if user exists
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', baseWalletAddress)
      .single();

    if (!user) {
      throw new Error('User not found');
    }

    // Check if Polygon wallet already exists
    const { data: existingWallet } = await supabase
      .from('user_wallets')
      .select('polygon_address')
      .eq('user_id', user.id)
      .single();

    if (existingWallet?.polygon_address) {
      return existingWallet.polygon_address;
    }

    // Create new Polygon wallet
    // Note: In production, you might want to derive this from the base wallet
    // For now, creating a new random wallet
    const polygonWallet = ethers.Wallet.createRandom();
    const polygonAddress = polygonWallet.address;
    const polygonPrivateKey = polygonWallet.privateKey;

    // Store wallet mapping in database
    const { error } = await supabase
      .from('user_wallets')
      .upsert({
        user_id: user.id,
        base_address: baseWalletAddress,
        polygon_address: polygonAddress,
        polygon_private_key: polygonPrivateKey, // In production, encrypt this!
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      throw new Error(`Failed to create Polygon wallet: ${error.message}`);
    }

    return polygonAddress;
  } catch (error) {
    console.error('Error getting/creating Polygon wallet:', error);
    throw error;
  }
}

// Get Polygon wallet address for a user
export async function getPolygonWalletAddress(baseWalletAddress) {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', baseWalletAddress)
      .single();

    if (!user) {
      return null;
    }

    const { data: wallet } = await supabase
      .from('user_wallets')
      .select('polygon_address')
      .eq('user_id', user.id)
      .single();

    return wallet?.polygon_address || null;
  } catch (error) {
    console.error('Error getting Polygon wallet:', error);
    return null;
  }
}

// Get Polygon private key (for signing transactions)
// WARNING: In production, this should be encrypted and stored securely
export async function getPolygonPrivateKey(baseWalletAddress) {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', baseWalletAddress)
      .single();

    if (!user) {
      return null;
    }

    const { data: wallet } = await supabase
      .from('user_wallets')
      .select('polygon_private_key')
      .eq('user_id', user.id)
      .single();

    return wallet?.polygon_private_key || null;
  } catch (error) {
    console.error('Error getting Polygon private key:', error);
    return null;
  }
}

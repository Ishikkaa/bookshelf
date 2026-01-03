package com.ishikapandita.bookshelf.service.address;

import com.ishikapandita.bookshelf.dtos.AddressDto;
import com.ishikapandita.bookshelf.model.Address;
import com.ishikapandita.bookshelf.repository.AddressRepository;
import com.ishikapandita.bookshelf.service.user.IUserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressService implements IAddressService {
    private final AddressRepository addressRepository;
    private final ModelMapper modelMapper;
    private final IUserService userService;

    @Override
    public List<Address> createAddress(List<Address> addressList, Long userId) {
        return Optional.ofNullable(userService.getUserById(userId))
                .map(user -> addressList.stream()
                        .peek(address -> address.setUser(user))
                        .toList())
                .map(addressRepository::saveAll)
                .orElse(Collections.emptyList());
    }

    @Override
    public List<Address> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Override
    public Address getAddressById(Long addressId) {
        return addressRepository.findById(addressId)
                .orElseThrow(() -> new EntityNotFoundException("Address not found!"));
    }

    @Override
    public void deleteAddress(Long addressId) {
        addressRepository.findById(addressId).ifPresentOrElse(addressRepository::delete, () -> {
            throw new EntityNotFoundException("Address not found!");
        });
    }

    @Override
    public Address updateAddress(Long id, Address address) {
        return addressRepository.findById(id).map(existingAddress -> {
            existingAddress.setCountry(address.getCountry());
            existingAddress.setPostalCode(address.getPostalCode());
            existingAddress.setState(address.getState());
            existingAddress.setCity(address.getCity());
            existingAddress.setAddressLine(address.getAddressLine());
            existingAddress.setAddressType(address.getAddressType());
            return addressRepository.save(existingAddress);
        }).orElseThrow(() -> new EntityNotFoundException("Address not found!"));
    }

    @Override
    public List<AddressDto> convertToDto(List<Address> addressList){
        return addressList.stream().map(this :: convertToDto).toList();

    }

    @Override
    public AddressDto convertToDto(Address address){
        return modelMapper.map(address, AddressDto.class);
    }
}
